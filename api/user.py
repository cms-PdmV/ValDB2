from core.database import get_database
from flask_restx.marshalling import marshal_with
from data.group import get_all_groups
from models.user import User, UserRole
from lookup.user_group import UserGroupLookup

from flask_restx import Resource
from core import Namespace


api = Namespace('users', description='Users and their permission groups')

user_model = api.model(User)

def precess_payload(body):
    if body['role'] == UserRole.ADMIN.value:
        body['groups'] = get_all_groups()
    if body['role'] == UserRole.USER.value:
        body['groups'] = []

@api.route('/')
class UserListAPI(Resource):

    @api.marshal_list_with(user_model)
    def get(self):
        users = list(get_database().database[User._get_collection_name()].find({}))
        return users

    @api.marshal_with(user_model)
    def post(self):
        body = api.payload
        precess_payload(body)
        user = User(body).save()
        lookup = UserGroupLookup()
        lookup.update()
        return user.dict()

@api.route('/<string:id>/')
@api.param('id', 'User UUID')
class UserAPI(Resource):

    @api.marshal_with(user_model)
    def get(self, id):
        return User.get(id).dict()

    @api.marshal_with(user_model)
    def put(self, id):
        body = api.payload
        precess_payload(body)
        user = User.get(id)
        user.update(body)
        lookup = UserGroupLookup()
        lookup.update()
        return user.dict()

    def delete(self, id):
        User.get(id).unlink()
        return 'ok'
