'''
Group API
'''
from flask_restx import Resource
from core import Namespace
from data.group import group

api = Namespace('groups', description='Show all available group in the system')

@api.route('/')
class GroupListAPI(Resource):
    '''
    Group list API
    '''

    def get(self):
        '''
        Get all groups
        '''
        groups = []
        for key, value in group.items():
            groups.append({
                'name': key,
                'subcategories': [{'name': k, 'groups': v} for k, v in value.items()]
            })
        return groups
