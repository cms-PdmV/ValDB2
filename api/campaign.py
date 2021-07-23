'''
Campaign API
'''
import pymongo

from flask_restx import Resource

from core.database import get_database
from core import Namespace
from models.campaign import Campaign
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
        campaigns = list(
            get_database().database[Campaign.get_collection_name()]
            .find({}, {'reports': False})
            .sort([('created_at', pymongo.DESCENDING)])
        )
        return campaigns

    @api.marshal_with(campaign_model)
    def post(self):
        '''
        Create campaign
        '''
        data = api.payload
        campaign = Campaign(data)
        campaign.parse_datetime()
        campaign.reports = []
        campaign.save()
        return campaign.dict()


@api.route('/<string:campaignname>/')
@api.param('campaignname', 'Campaign Short ID')
class CampaignAPI(Resource):
    '''
    Campaign API
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
                    'category': category,
                    'subcategories': [],
                }
            subcategory = category_subcategory.split('.')[1]
            groups = [f'{category_subcategory}.{each_group}'
                for each_group in group[category][subcategory]
            ]
            campaign_group[category]['subcategories'].append({
                'subcategory': subcategory,
                'groups': [{
                    'name': g,
                    'report': report_table.get(g).dict() if g in report_table else None,
                } for g in groups],
            })
        groups = list(campaign_group.values())

        return {
            'campaign': campaign.dict(),
            'groups': groups,
        }
