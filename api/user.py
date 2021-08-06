'''
User API
'''
import logging

from flask.globals import request
from flask_restx import Resource

from utils.query import add_skip_and_limit, build_query, build_sort, serialize_raw_query
from utils.user import require_permission
from utils.request import parse_list_of_tuple
from core import Namespace
from core.database import get_database
from data.group import get_all_groups
from models.user import User, UserRole
from lookup.user_group import UserGroupLookup


api = Namespace('users', description='Users and their permission groups')
_logger = logging.getLogger('api.user')

user_model = api.model(User)

def precess_payload(body):
    '''
    Process payload from api
    - if role is admin, then append all roles to user
    - if role is user, then remoce all roles from user
    '''
    if 'role' in body:
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
        require_permission(request, [UserRole.ADMIN])
        query_params = request.args
        sorting = parse_list_of_tuple(query_params.get('sort'))
        database_query = build_query(['fullname', 'email'], query_params)
        query = get_database().database[User.get_collection_name()].find(database_query)
        if sorting:
            query.sort(build_sort(sorting))
        add_skip_and_limit(query, query_params)
        return serialize_raw_query(query)

    @api.marshal_with(user_model)
    def post(self):
        '''
        Create new user
        '''
        require_permission(request, [UserRole.ADMIN])
        body = api.payload
        precess_payload(body)
        user = User(body).save()
        lookup = UserGroupLookup()
        lookup.update()
        return user.dict()

@api.route('/me/')
class UserInfoAPI(Resource):
    '''
    Current User Info API
    '''
    def get(self):
        '''
        Get current user info from request
        '''
        email = request.environ.get('user').get('email')
        fullname = request.environ.get('user').get('fullname')
        _logger.info('User info request: %s', email)
        existed_user = User.get_by_email(email)
        if not existed_user:
            _logger.info('User not existed. Create new user with email: %s', email)
            existed_user = User({
                'role': UserRole.USER,
                'email': email,
                'fullname': fullname,
                'groups': [],
            }).save()
        else:
            if (not existed_user.fullname) and fullname:
                _logger.info('Update fullname for: %s', email)
                existed_user.fullname = fullname
                existed_user.save()
        return existed_user.dict()

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
        require_permission(request, [UserRole.ADMIN])
        return User.get(userid).dict()

    @api.marshal_with(user_model)
    def put(self, userid):
        '''
        Update user
        '''
        require_permission(request, [UserRole.ADMIN])
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
        require_permission(request, [UserRole.ADMIN])
        User.get(userid).unlink()
        return 'ok'
