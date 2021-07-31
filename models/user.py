'''
User model
'''
from enum import Enum

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
