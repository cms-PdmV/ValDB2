'''
Report API
'''
import pymongo
from flask.globals import session
from flask_restx import Resource
from werkzeug.exceptions import Forbidden

from emails.report_email import ModifyReportEmailTemplate, ChangeStatusReportEmailTemplate
from utils.group import get_subcategory_from_group
from core import Namespace
from models.report import Report, ReportStatus
from models.campaign import Campaign
from models.user import User


DEFAULT_REPORT_STATUS = ReportStatus.NOT_YET_DONE

api = Namespace('reports', description='Report in the system')

report_model = api.model(Report)

@api.route('/')
class ReportListAPI(Resource):
    '''
    Report list API
    '''
    def post(self):
        '''
        Create new report
        body: {
            campaign_name: string
            group: string
            user: string
        }
        '''
        campaign_name = api.payload['campaign_name']
        group = api.payload['group']
        campaign = Campaign.get_by_name(campaign_name)
        new_report = Report()
        new_report.authors = []
        new_report.status = DEFAULT_REPORT_STATUS
        new_report.campaign_name = campaign_name
        new_report.content = ''
        new_report.group = group
        new_report.save()
        campaign.reports.append(new_report)
        campaign.save()
        return new_report.dict()

@api.route('/assigned/')
class AssignedReportAPI(Resource):
    '''
    Assigned Report of User
    '''
    def get(self):
        '''
        Get assign report
        '''
        user = User.get_from_session(session)
        user_subcategories = [get_subcategory_from_group(group) for group in user.groups]
        assigned_reports = []
        assigned_open_campaigns = Campaign.query({
            'is_open': True,
            'subcategories': {'$in': user_subcategories}
        }, sort=[('created_at', pymongo.DESCENDING)], option={'reports': False})
        for campaign in assigned_open_campaigns:
            for group in user.groups:
                user_subcategory = get_subcategory_from_group(group)
                if user_subcategory in campaign.subcategories:
                    report = Report.search(campaign.name, group)
                    if not report:
                        report = Report({
                            'group': group,
                            'campaign_name': campaign.name,
                            'status': DEFAULT_REPORT_STATUS,
                        })
                    assigned_reports.append(report.dict())
        return assigned_reports

@api.route('/search/<string:campaign>/<string:group>/')
@api.param('campaign', 'Campaign name')
@api.param('group', 'Group path related to the report')
class ReportSearchAPI(Resource):
    '''
    Report search API
    '''
    def get(self, campaign, group):
        '''
        Search report by campaign name and group name
        '''
        report = Report.search(campaign, group)
        if not report:
            return None
        return report.dict()

@api.route('/<string:reportid>/')
@api.param('reportid', 'Report id')
class ReportAPI(Resource):
    '''
    Report API
    '''
    def put(self, reportid):
        '''
        Update report content
        body: Report
        '''
        report = Report.get(reportid)
        previous_report_status = report.status
        user = User.get_from_session(session=session)
        if report.group not in user.groups:
            raise Forbidden()
        if 'authors' in api.payload:
            api.payload.pop('authors')
        report.update(api.payload)
        if 'content' in api.payload:
            previous_authors = []
            if report.authors:
                previous_authors = [author for author in report.authors if author.id != user.id]
            new_authors = [user] + previous_authors
            report.authors = new_authors
            report.save()
            ModifyReportEmailTemplate().build(report).send()
        if 'status' in api.payload:
            ChangeStatusReportEmailTemplate().build(report, previous_report_status).send()
        return report.dict()
