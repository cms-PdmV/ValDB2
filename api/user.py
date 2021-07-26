'''
User API
'''
from flask.globals import request
from flask_restx import Resource

from utils.query import add_skip_and_limit, build_query, serialize_raw_query
from core import Namespace
from core.database import get_database
from data.group import get_all_groups
from models.user import User, UserRole
from lookup.user_group import UserGroupLookup


api = Namespace('users', description='Users and their permission groups')

user_model = api.model(User)

def precess_payload(body):
    '''
    Process payload from api
    - if role is admin, then append all roles to user
    - if role is user, then remoce all roles from user
    '''
    if body['role'] == UserRole.ADMIN.value:
        body['groups'] = get_all_groups()
    if body['role'] == UserRole.USER.value:
        body['groups'] = []

@api.route('/')
class UserListAPI(Resource):
    '''
    User list API
    '''
    @api.marshal_list_with(user_model)
    def get(self):
        '''
        Get all users
        '''
        query_params = request.args
        database_query = build_query(['fullname', 'email'], query_params)
        query_result = get_database().database[User.get_collection_name()].find(database_query)
        add_skip_and_limit(query_result, query_params)
        return serialize_raw_query(query_result)

    @api.marshal_with(user_model)
    def post(self):
        '''
        Create new user
        '''
        body = api.payload
        precess_payload(body)
        user = User(body).save()
        lookup = UserGroupLookup()
        lookup.update()
        return user.dict()

@api.route('/<string:userid>/')
@api.param('userid', 'User UUID')
class UserAPI(Resource):
    '''
    User API
    '''
    @api.marshal_with(user_model)
    def get(self, userid):
        '''
        Get user by id
        '''
        return User.get(userid).dict()

    @api.marshal_with(user_model)
    def put(self, userid):
        '''
        Update user
        '''
        body = api.payload
        precess_payload(body)
        user = User.get(userid)
        user.update(body)
        lookup = UserGroupLookup()
        lookup.update()
        return user.dict()

    def delete(self, userid):
        '''
        Delete user
        '''
        User.get(userid).unlink()
        return 'ok'
