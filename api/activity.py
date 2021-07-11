from models.report import Report
from models.activity import Activity

from flask_restx import Resource
from core import Namespace


api = Namespace('reports', description='Report in the system')

activity_model = api.model(Activity)

@api.route('/<string:reportid>/')
@api.param('reportid', 'Report id')
class ActivityAPI(Resource):
    def get(self, reportid):
        report = Report.get(reportid).dict()
        return report['activities'] or []

    def post(self, reportid):
        print(api.payload)
        report = Report.get(reportid)
        activity = Activity(api.payload).save()
        # print(activity)
        print(activity.user)
        if not report.activities:
            report.activities = []
        report.activities.append(activity)
        report.save()
        print('--------------------------------')
        print(report.activities[-1].user)
        print('--------------------------------')
        return 'ok'
