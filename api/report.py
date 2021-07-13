from models.report import Report, ReportStatus

from models.campaign import Campaign
from flask_restx import Resource
from core import Namespace


api = Namespace('reports', description='Report in the system')

report_model = api.model(Report)

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
    @api.marshal_with(report_model)
    def get(self, campaign, group):
        result = Report.query({
            'campaign_name': campaign,
            'group': group,
        })

        if not result:
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
