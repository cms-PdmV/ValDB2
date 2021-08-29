'''
Report model
'''
from enum import Enum

from models.attachment import Attachment
from models.activity import Activity
from models.user import User
from core.validation import required
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

REPORT_STATUS_LABEL = {
    ReportStatus.OK: 'OK',
    ReportStatus.NOT_YET_DONE: 'Not Yet Done',
    ReportStatus.FAILURE: 'Failure',
    ReportStatus.CHANGES_EXPECTED: 'Changes Expected',
    ReportStatus.IN_PROGRESS: 'In Progress',
    ReportStatus.KNOWN_ISSUE: 'Known Issue',
}

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

    _validation = {
        'group': [required()],
        'campaign_name': [required()],
        'status': [required()],
    }

    @classmethod
    def search(cls, campaign_name, group):
        '''
        Search report by campaign name and group path
        '''
        return cls.query_one({
            'campaign_name': campaign_name,
            'group': group,
        })
