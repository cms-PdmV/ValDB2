'''
User model
'''
from enum import Enum

from core import Model

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
