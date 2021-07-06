from models.report import Report, ReportStatus
from api import campaign
from core.database import get_database
from datetime import datetime

import pymongo
from pymongo.database import Database
from models.campaign import Campaign
from flask_restx import Resource
from flask_cors import cross_origin
from core import Namespace
from data.group import group

api = Namespace('reports', description='Report in the system')

campaign_model = api.model(Campaign)

@api.route('/')
class ReportListAPI(Resource):
    '''
    body: {
        campaign_name: string
        group: string
        user: string
    }
    '''
    def post(self):
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

@api.route('/search/<string:campaign>/<string:group>/')
@api.param('campaign', 'Campaign name')
@api.param('group', 'Group path related to the report')
class ReportSearchAPI(Resource):
    def get(self, campaign, group):
        print('a')
        result = Report.query({
            'campaign_name': campaign,
            'group': group,
        })

        if len(result) == 0:
            return {'message': 'not found'}, 404

        return result[0].dict()

@api.route('/<string:id>/')
@api.param('id', 'Report id')
class ReportAPI(Resource):
    '''
    body: {
        content: string
        user: string
    }
    '''
    def put(self, id):
        report = Report.get(id)
        report.update(api.payload)
        return report.dict()
