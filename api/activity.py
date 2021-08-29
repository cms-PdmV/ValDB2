'''
Activity API
'''
from flask.globals import request
from flask_restx import Resource

from emails.report_email import NewCommentReportEmailTemplate
from models.report import Report
from models.activity import Activity, ActivityType
from models.user import User
from core import Namespace


api = Namespace('reports', description='Report in the system')

activity_model = api.model(Activity)

@api.route('/<string:reportid>/')
@api.param('reportid', 'Report id')
class ActivityAPI(Resource):
    '''
    Activity API
    '''
    def get(self, reportid):
        '''
        Get activity by id
        '''
        report = Report.get(reportid).dict()
        return report['activities'] or []

    def post(self, reportid):
        '''
        Create activity
        body: Activity
        '''
        report = Report.get(reportid)
        user = User.get_from_request(request)
        api.payload['user'] = user.id
        activity = Activity(api.payload).save()
        if not report.activities:
            report.activities = []
        report.activities.append(activity)
        report = report.save()
        if activity.type == ActivityType.COMMENT.value:
            NewCommentReportEmailTemplate().build(report, activity).send()
        return 'ok'
