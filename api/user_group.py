from pymongo.common import VALIDATORS
from lookup.user_group import UserGroupLookup, administrator_key
from core.database import get_database
from flask_restx.marshalling import marshal_with
from data.group import get_all_groups
from models.user import User, UserRole

from flask_restx import Resource
from core import Namespace


api = Namespace('user permission groups', description='Get group of users in each permission group')

@api.route('/get/<string:group_path>/')
@api.param('group_path', 'Group path string or "Administrator"')
class UserGroupAPI(Resource):

    def get(self, group_path):
        lookup = UserGroupLookup()
        from pprint import pprint
        pprint(lookup.table)
        user_ids = lookup.table[group_path]
        users = [User.get(user_id) for user_id in user_ids]
        return [user.dict() for user in users]

@api.route('/add/')
class UserGroupAddAPI(Resource):

    def post(self):
        '''
        body {
            email: string,
            group: string,
        }
        '''
        email = api.payload['email']
        group = api.payload['group']
        UserGroupController.add_user_to_group(email, group)


@api.route('/remove/')
class UserGroupRemoveAPI(Resource):

    def post(self):
        '''
        body {
            userid: string,
            group: string,
        }
        '''
        userid = api.payload['userid']
        group = api.payload['group']
        UserGroupController.remove_user_from_group(userid, group)


class UserGroupController():
    @staticmethod
    def add_user_to_group(email, group):
        lookup = UserGroupLookup()
        if group in lookup.table:
            user = User.query_one({'email': email})
            target_role = UserRole.ADMIN if group == administrator_key else UserRole.VALIDATOR
            if not user:
                user = User({
                    'email': email,
                    'role': target_role.value,
                    'groups': [],
                }).save()
            else:
                if user.role == UserRole.ADMIN and group != administrator_key:
                    raise Exception('cannot add admin to validator group. please remove this user from admin role')
            
            if target_role == UserRole.ADMIN:
                user.groups = get_all_groups()
            elif target_role == UserRole.VALIDATOR:
                if group not in user.groups:
                    user.groups.append(group)
            user.role = target_role
            user.save()
            lookup.add_user_to_group(user._id, group)
        else:
            raise Exception('group is not in table')

    @staticmethod
    def remove_user_from_group(user_id, group):
        lookup = UserGroupLookup()
        if group in lookup.table:
            user = User.get(user_id)
            if user:
                if group == administrator_key:
                    user.role = UserRole.USER
                    user.groups = []
                    user.save()
                else:
                    user.groups.remove(group)
                    user.save()
                lookup.remove_user_from_group(user_id, group)
