"""
Campaign API
"""
import os
from copy import deepcopy
from flask.globals import request, session
from flask_restx import Resource
from emails.campaign_email import (
    OpenCampaignEmailTemplate,
    SignOffCampaignEmailTemplate,
)
from utils.query import add_skip_and_limit, build_query, build_sort
from utils.user import require_permission
from utils.request import parse_list_of_tuple
from utils.logger import api_logger
from core.database import get_database
from core import Namespace
from models.campaign import Campaign
from models.user import UserRole, User
from models.report import Report
from data.group import group


api = Namespace(
    "campaigns",
    description="Manager can create, read, update and delete campaign in the system",
)
_logger = api_logger
campaign_model = api.model(Campaign)


@api.route("/")
class CampaignListAPI(Resource):
    """
    Campaign list API
    """

    @api.marshal_list_with(campaign_model)
    def get(self):
        """
        Get all campaign list
        """
        query_params = request.args
        _logger.info("Retriving all campaigns - Query: %s", query_params)
        sorting = parse_list_of_tuple(query_params.get("sort"))
        database_query = build_query(["name"], query_params)
        query = (
            get_database()
            .database[Campaign.get_collection_name()]
            .find(database_query, {"reports": False})
            .collation({"locale": "en_US", "numericOrdering": True})
        )
        if sorting:
            query.sort(build_sort(sorting))
        add_skip_and_limit(query, query_params)
        campaigns = list(query)
        return campaigns

    @api.marshal_with(campaign_model)
    def post(self):
        """
        Create campaign
        """
        require_permission(session=session, roles=[UserRole.ADMIN])
        data = api.payload
        campaign = Campaign(data)
        _logger.info("Creating campaign: %s", campaign.name)
        campaign.parse_datetime()
        campaign.reports = []
        campaign.save()
        OpenCampaignEmailTemplate().build(campaign).send_campaign_notification(
            campaign=campaign, open_campaign=True
        )
        return campaign.dict()


@api.route("/get/<string:campaignname>/")
@api.param("campaignname", "Campaign Short ID")
class CampaignGetAPI(Resource):
    """
    Campaign Get API
    """

    def get(self, campaignname):
        """
        Get campaign by id
        """
        campaign = Campaign.get_by_name(campaignname)
        _logger.info("Retriving campaign: %s", campaign.name)
        if not campaign:
            _logger.error("Campaign %s not found", campaign.name)
            return {"message": "not found"}, 404

        # report lookup table
        report_table = {}
        for report in campaign.reports:
            report.content = ""
            report_table[report.group] = report

        # get groups form sub categories
        campaign_group = {}
        for category_subcategory in campaign.subcategories:
            category = category_subcategory.split(".")[0]
            if category not in campaign_group:
                campaign_group[category] = {
                    "name": category,
                    "subcategories": [],
                }
            subcategory = category_subcategory.split(".")[1]
            if subcategory not in group[category]:
                continue
            groups = [
                f"{category_subcategory}.{each_group}"
                for each_group in group[category][subcategory]
            ]
            campaign_group[category]["subcategories"].append(
                {
                    "name": subcategory,
                    "groups": [
                        {
                            "path": g,
                            "report": report_table.get(g).dict()
                            if g in report_table
                            else None,
                        }
                        for g in groups
                    ],
                }
            )
        groups = list(campaign_group.values())

        return {
            "campaign": campaign.dict(),
            "groups": groups,
        }


@api.route("/<string:campaignid>/")
@api.param("campaignid", "Campaign ID")
class CampaignAPI(Resource):
    """
    Campaign API
    """

    def put(self, campaignid):
        """
        Update campaign by id
        """
        require_permission(session=session, roles=[UserRole.ADMIN])
        campaign = Campaign.get(campaignid)
        _logger.info("Updating campaign: %s", campaign.name)
        campaign.parse_datetime()
        campaign.update(api.payload)
        if "name" in api.payload:
            for report in campaign.reports:
                report.campaign_name = campaign.name
                report.save()
        if "is_open" in api.payload and api.payload["is_open"] is False:
            SignOffCampaignEmailTemplate().build(campaign).send_campaign_notification(
                campaign=campaign
            )
        return campaign.dict()


@api.route("/migrate/")
class CampaignMigrationAPI(Resource):
    """
    Migrate a campaign with asociated reports
    """

    def post(self):
        """
        Create campaign
        """
        require_permission(
            session=session, roles=[os.getenv("MANAGEMENT_ROLE")], from_sso=True
        )
        # Create a default campaign
        data = api.payload
        reports_to_create = data.pop("reports")
        campaign_data = deepcopy(data)
        campaign = Campaign(campaign_data)
        _logger.info("Bulking campaign: %s", campaign.name)
        campaign = campaign.save()

        # Campaign reports
        campaign_reports: list[Report] = []

        for report in reports_to_create:
            report_authors_emails = report["authors"]
            report_authors: list[User] = []
            for email in report_authors_emails:
                user = User.get_by_email(email)
                if user:
                    report_authors.append(user)

            report["authors"] = report_authors
            new_report: Report = Report(report)
            new_report.campaign = campaign
            new_report = new_report.save()
            campaign_reports += [new_report]

        campaign.reports = campaign_reports
        campaign.parse_datetime()
        campaign = campaign.save()
        return campaign.dict()


@api.route("/comparison/")
class CampaignReportComparison(Resource):
    """
    Retrieve all the reports related to a group of campaigns
    to compare the reports progress.
    """

    def get(self):
        search_by: str = request.args.get("search", "")
        if not search_by:
            cause: str = "No search query provided"
            _logger.error(cause)
            return {"message": cause}, 400
        try:
            return self.__retrieve_comparison(search=search_by)
        except Exception as e:
            _logger.error(e, stack_info=True)
            return {
                "message": "Unable to retrieve a comparison from query"
            }

    def __retrieve_comparison(self, search: str):
        """
        Retrieve the information for the desired campaigns and format
        the result as required.

        Args:
            search (str): Regex to filter the desired campaigns
                by name.
        """
        campaigns: list[Campaign] = self.__get_campaigns_comparison(search=search)
        grouped: dict = self.__group_campaigns_reports(campaigns=campaigns)
        groups_arranged: list = self.__arrange_elements(grouped=grouped)
        result: dict = {
            "campaigns": [c.name for c in campaigns],
            "categories": groups_arranged,
            "regex": search,
        }
        return result

    def __get_campaigns_comparison(self, search: str) -> list[Campaign]:
        """
        Retrieve the information related to all the campaigns
        whose name matches the regex given
        
        Args:
            search (str): Regex to filter the desired campaigns
                by name.
        Returns:
            list[Campaign]: Related campaigns.
        """
        database_query = build_query(["name"], {"search": search})
        campaign_query_result = (
            get_database()
            .database[Campaign.get_collection_name()]
            .find(database_query, {"reports": False})
            .collation({"locale": "en_US", "numericOrdering": True})
        )
        campaigns: Campaign = [
            Campaign.get_by_name(result.get("name"))
            for result in campaign_query_result
        ]
        return campaigns
    
    def __group_campaigns_reports(self, campaigns: list[Campaign]) -> dict:
        """
        Group all the reports in the campaigns per category, subcategory 
        and include the report status per each group.

        Args:
            campaings (list[Campaign]): Campaigns to compare.
        Returns:
            dict: Report's statuses for all the campaigns involved group by
                category and subcategory.
        """
        category: dict = {}
        for campaign in campaigns:
            campaign_name: str = campaign.name
            for report in campaign.reports:
                report_category, report_subcategory, report_group = report.get_group_components()
                campaign_progress = {"campaign": campaign_name, "status": report.status.value}
                
                stored_category = category.get(report_category, {})
                stored_subcategory = stored_category.get(report_subcategory, {})
                stored_group = stored_subcategory.get(report_group, [])
                stored_group.append(campaign_progress)

                stored_subcategory[report_group] = stored_group
                stored_category[report_subcategory] = stored_subcategory
                category[report_category] = stored_category
        
        return category
    
    def __arrange_elements(self, grouped: dict) -> dict:
        """
        Arranges the elements into another order

        Args:
            grouped (dict): Report's statuses for all the campaigns involved group by
                category and subcategory.
        """
        result: list = []
        for category, category_content in grouped.items():
            subcategories_parsed: list = []
            for subcategory, subcategory_content in category_content.items():
                groups_parsed: list = []
                for group, campaing_report_status in subcategory_content.items():
                    groups_parsed.append({
                        "group": group,
                        "path": f"{category}.{subcategory}.{group}",
                        "status": campaing_report_status
                    })
                subcategories_parsed.append({
                    "subcategory": subcategory,
                    "groups": groups_parsed
                })
            result.append({
                "category": category,
                "subcategories": subcategories_parsed
            })
        return result
    