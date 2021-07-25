'''
Report API
'''
import pymongo
from bson.objectid import ObjectId
from flask.globals import request
from flask_restx import Resource

from utils.query import add_skip_and_limit, serialize_raw_query
from core.database import get_database
from models.report import Report, ReportStatus
from models.campaign import Campaign
from core import Namespace


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
        new_report.status = ReportStatus.NOT_YET_DONE
        new_report.campaign_name = campaign_name
        new_report.content = ''
        new_report.group = group
        new_report.save()
        campaign.reports.append(new_report)
        campaign.save()
        return new_report.dict()

@api.route('/user/<string:userid>/')
@api.param('userid', 'Report id')
class ReportAPI(Resource):
    '''
    Report of users API
    '''
    @api.marshal_list_with(report_model)
    def get(self, userid):
        '''
        Get report related to user
        '''
        query_params = request.args
        query_result = get_database().database[Report.get_collection_name()] \
            .find(
                {'authors': ObjectId(userid)}, 
                {'content': False, 'authors': False, 'activities': False, 'attachments': False}) \
            .sort([('created_at', pymongo.DESCENDING)])
        add_skip_and_limit(query_result, query_params)
        from pprint import pprint
        res = serialize_raw_query(query_result)
        pprint(res)
        pprint(res)
        return res

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
        result = Report.query({
            'campaign_name': campaign,
            'group': group,
        })

        if not result:
            return {'message': 'not found'}, 404

        return result[0].dict()

@api.route('/<string:reportid>/')
@api.param('reportid', 'Report id')
class ReportAPI(Resource):
    '''
    Report API
    '''

    def put(self, reportid):
        '''
        Get report by id
        body: {
            content: string
            user: string
        }
        '''
        report = Report.get(reportid)
        report.update(api.payload)
        return report.dict()
