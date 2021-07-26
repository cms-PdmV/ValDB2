'''
Activity model
'''
from enum import Enum

from core import Model
from models.user import User

class ActivityType(Enum):
    '''
    Activity type
    '''
    ACTIVITY = 1
    COMMENT = 2

class Activity(Model):
    '''
    Activity model
    '''
    type: ActivityType
    user: User
    content: str
