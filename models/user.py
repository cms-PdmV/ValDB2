'''
User model
'''
from enum import Enum

from werkzeug.exceptions import Forbidden

from core.validation import regex, required
from core import Model
from core_lib.middlewares.auth import UserInfo as MiddlewareUserInfo

EMAIL_FORMAT = r'(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)'

class UserRole(Enum):
    '''
    User role in the system
    '''
    ADMIN = 1
    VALIDATOR = 2
    USER = 3

USER_ROLE_LABEL = {
    UserRole.ADMIN: 'Administrator',
    UserRole.VALIDATOR: 'Validator',
    UserRole.USER: 'Base User',
}

class User(Model):
    '''
    User model
    '''
    role: UserRole
    email: str
    fullname: str
    groups: list[str]

    _validation = {
        'email': [required(), regex(EMAIL_FORMAT, example='example@cern.ch')],
    }

    @classmethod
    def get_by_email(cls, email):
        '''
        Get user by email
        '''
        return cls.query_one({'email': email})

    @classmethod
    def get_from_session(cls, session):
        '''
        Get user from request
        '''
        user_data: MiddlewareUserInfo = session.get("user")
        return cls.get_by_email(user_data.email)

    def requires(self, roles):
        '''
        Check permission of user
        Raise Forbidden if error
        '''
        if self.role not in roles:
            raise Forbidden()
