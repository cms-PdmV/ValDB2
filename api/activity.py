'''
Activity API
'''
from collections import deque
from flask.globals import session
from flask_restx import Resource

from emails.report_email import NewCommentReportEmailTemplate
from models.report import Report
from models.campaign import Campaign
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
        campaign = Campaign.get_by_name(report.campaign_name)
        user = User.get_from_session(session)

        api.payload['user'] = user.id
        activity = Activity(api.payload).save()
        if not report.activities:
            report.activities = []

        # Append the latest activity inside the Queue
        latest_activities = []
        if campaign.latest_activities:
            latest_activities = campaign.latest_activities
        campaign.latest_activities = deque(
            latest_activities,
            maxlen=Campaign.MAX_LASTEST_ACTIVITY_QUEUE
        )
        record = (report.group, activity.created_at.isoformat())
        campaign.latest_activities.appendleft(record)
        campaign.latest_activities = list(campaign.latest_activities)

        report.activities.append(activity)
        report = report.save()
        campaign = campaign.save()
        if activity.type == ActivityType.COMMENT:
            NewCommentReportEmailTemplate().build(report, activity).send()
        return 'ok'
