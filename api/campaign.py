'''
Campaign API
'''
import os
from copy import deepcopy

from flask.globals import request
from flask_restx import Resource

from emails.campaign_email import OpenCampaignEmailTemplate, SignOffCampaignEmailTemplate
from utils.query import add_skip_and_limit, build_query, build_sort
from utils.user import require_permission
from utils.request import parse_list_of_tuple
from core.database import get_database
from core import Namespace
from models.campaign import Campaign
from models.user import UserRole, User
from models.report import Report
from data.group import group


api = Namespace('campaigns',
    description='Manager can create, read, update and delete campaign in the system'
)

campaign_model = api.model(Campaign)

@api.route('/')
class CampaignListAPI(Resource):
    '''
    Campaign list API
    '''
    @api.marshal_list_with(campaign_model)
    def get(self):
        '''
        Get all campaign list
        '''
        query_params = request.args
        sorting = parse_list_of_tuple(query_params.get('sort'))
        database_query = build_query(['name'], query_params)
        query = get_database().database[Campaign.get_collection_name()] \
            .find(database_query, {'reports': False}) \
            .collation({'locale': 'en_US', 'numericOrdering': True})
        if sorting:
            query.sort(build_sort(sorting))
        add_skip_and_limit(query, query_params)
        campaigns = list(query)
        return campaigns

    @api.marshal_with(campaign_model)
    def post(self):
        '''
        Create campaign
        '''
        require_permission(request, [UserRole.ADMIN])
        data = api.payload
        campaign = Campaign(data)
        campaign.parse_datetime()
        campaign.reports = []
        campaign.save()
        OpenCampaignEmailTemplate().build(campaign).send()
        return campaign.dict()


@api.route('/get/<string:campaignname>/')
@api.param('campaignname', 'Campaign Short ID')
class CampaignGetAPI(Resource):
    '''
    Campaign Get API
    '''
    def get(self, campaignname):
        '''
        Get campaign by id
        '''
        campaign = Campaign.get_by_name(campaignname)
        if not campaign:
            return {'message': 'not found'}, 404

        # report lookup table
        report_table = {}
        for report in campaign.reports:
            report.content = ''
            report_table[report.group] = report

        # get groups form sub categories
        campaign_group = {}
        for category_subcategory in campaign.subcategories:
            category = category_subcategory.split('.')[0]
            if category not in campaign_group:
                campaign_group[category] = {
                    'name': category,
                    'subcategories': [],
                }
            subcategory = category_subcategory.split('.')[1]
            if subcategory not in group[category]:
                continue
            groups = [f'{category_subcategory}.{each_group}'
                for each_group in group[category][subcategory]
            ]
            campaign_group[category]['subcategories'].append({
                'name': subcategory,
                'groups': [{
                    'path': g,
                    'report': report_table.get(g).dict() if g in report_table else None,
                } for g in groups],
            })
        groups = list(campaign_group.values())

        return {
            'campaign': campaign.dict(),
            'groups': groups,
        }

@api.route('/<string:campaignid>/')
@api.param('campaignid', 'Campaign ID')
class CampaignAPI(Resource):
    '''
    Campaign API
    '''
    def put(self, campaignid):
        '''
        Update campaign by id
        '''
        require_permission(request, [UserRole.ADMIN])
        campaign = Campaign.get(campaignid)
        campaign.update(api.payload)
        if 'name' in api.payload:
            for report in campaign.reports:
                report.campaign_name = campaign.name
                report.save()
        if 'is_open' in api.payload and api.payload['is_open'] is False:
            SignOffCampaignEmailTemplate().build(campaign).send()
        return campaign.dict()


@api.route('/migrate/')
class CampaignMigrationAPI(Resource):
    '''
    Migrate a campaign with asociated reports
    '''
    def post(self):
        '''
        Create campaign
        '''
        require_permission(
            request=request,
            roles=[os.getenv('MANAGEMENT_EGROUP')],
            from_sso=True
        )
        # Create a default campaign
        data = api.payload
        reports_to_create = data["reports"]
        campaign_data = deepcopy(data)
        campaign_reports: list[Report] = []
        campaign_data["reports"] = []
        campaign = Campaign(campaign_data)
        campaign.save()

        for report in reports_to_create:
            report_authors_emails = report["authors"]
            report_authors: list[User] = []
            for email in report_authors_emails:
                user = User.get_by_email(email)
                if user:
                    report_authors.append(user)

            report["authors"] = report_authors
            new_report: Report = Report(report)
            campaign_to_link = Campaign.get_by_name(campaign_data["name"])
            new_report.campaign = campaign_to_link
            new_report.save()
            # Seems we have to refresh the reference....
            report_link = Report.search(report["campaign_name"], report["group"])
            campaign_reports.append(report_link)
        
        campaign = Campaign.get_by_name(campaign_data["name"])
        campaign.reports = campaign_reports
        campaign.parse_datetime()
        campaign.save()
        return campaign.dict()
