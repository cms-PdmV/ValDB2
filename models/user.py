'''
User model
'''
from enum import Enum

from werkzeug.exceptions import Forbidden

from core.validation import regex, required
from core import Model

CERN_EMAIL_FORMAT = r'\b[A-Za-z0-9._%+-]+@cern\.ch\b'

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
        'email': [required(), regex(CERN_EMAIL_FORMAT, example='example@cern.ch')],
    }

    @classmethod
    def get_by_email(cls, email):
        '''
        Get user by email
        '''
        return cls.query_one({'email': email})

    @classmethod
    def get_from_request(cls, request):
        '''
        Get user from request
        '''
        email = request.environ.get('user').get('email')
        return cls.get_by_email(email)

    def requires(self, roles):
        '''
        Check permission of user
        Raise Forbidden if error
        '''
        if self.role not in roles:
            raise Forbidden()
