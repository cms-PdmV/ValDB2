from enum import Enum

from core import Model
from .user import User

class ActivityType(Enum):
    ACTIVITY = 1
    COMMENT = 2

class Activity(Model):
    type: ActivityType
    user: User
    content: str
