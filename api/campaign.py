from core.database import get_database
from datetime import datetime

import pymongo
from pymongo.database import Database
from models.campaign import Campaign
from flask_restx import Resource
from flask_cors import cross_origin
from core import Namespace
from data.group import group
from bson import json_util

import json
from bson import ObjectId

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


api = Namespace('campaigns', description='Manager can create, read, update and delete campaign in the system', decorators=[cross_origin()])

campaign_model = api.model(Campaign)

@api.route('/')
class CampaignListAPI(Resource):
    @api.marshal_list_with(campaign_model)
    def get(self):
        # TODO: Pageination
        # TODO: ORM is very slow
        # campaigns = get_database()().query(Campaign._get_collection_name(), {}, [('created_at', pymongo.DESCENDING)])
        campaigns = list(get_database()().database[Campaign._get_collection_name()].find({}, {'reports': False}).sort([('created_at', pymongo.DESCENDING)]))
        print(list(campaigns))
        return campaigns

    @api.marshal_with(campaign_model)
    def post(self):
        print(api.payload)
        data = api.payload
        # data['deadline'] = datetime.strptime(data['deadline'], '%Y-%m-%d')
        print(data)
        print(Campaign(data))
        campaign = Campaign(data)
        campaign.parse_datetime()
        campaign.reports = []
        print(campaign)
        campaign.save()
        print(campaign)
        return campaign.dict()
        # new_todo = Todo(api.payload).save()
        # return new_todo.dict()


@api.route('/<string:campaignname>/')
@api.param('campaignname', 'Campaign Short ID')
class CampaignAPI(Resource):
    # @api.marshal_with(campaign_model)
    def get(self, campaignname):
        campaign = Campaign.get_by_name(campaignname)
        # print(result)
        if not campaign:
            return {'message': 'not found'}, 404

        print(campaign.reports)
        # report loockup table
        report_table = {}
        for report in campaign.reports:
            report_table[report.group] = report

        # get groups form sub cat
        # TODO: may need to create function
        campaign_group = {}
        for category_subcategory in campaign.subcategories:
            category = category_subcategory.split('.')[0]
            if category not in campaign_group:
                campaign_group[category] = {
                    'category': category,
                    'subcategories': [],
                }
            subcategory = category_subcategory.split('.')[1]
            groups = [f'{category_subcategory}.{each_group}' for each_group in group[category][subcategory]]
            campaign_group[category]['subcategories'].append({
                'subcategory': subcategory,
                'groups': [{
                    'name': g,
                    'report': report_table.get(g).dict() if g in report_table else None,
                } for g in groups],
            })
        groups = [value for value in campaign_group.values()]
        # from pprint import pprint
        # pprint(groups)
        print('return')
        return {
            'campaign': campaign.dict(),
            'groups': groups,
        }

    # @api.marshal_with(todo_model)
    # def put(self, id):
    #     return Todo.get(id).update(api.payload).dict()

    # def delete(self, id):
    #     return Todo.get(id).unlink()
