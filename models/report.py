'''
Report model
'''
from enum import Enum

from models.attachment import Attachment
from models.activity import Activity
from models.user import User
from core import Model

class ReportStatus(Enum):
    '''
    Report status
    '''
    OK = 1
    NOT_YET_DONE = 2
    FAILURE = 3
    CHANGES_EXPECTED = 4
    IN_PROGRESS = 5
    KNOWN_ISSUE = 6

class Report(Model):
    '''
    Report model
    '''
    authors: list[User]
    group: str
    campaign_name: str
    status: ReportStatus
    content: str
    activities: list[Activity]
    attachments: list[Attachment]
