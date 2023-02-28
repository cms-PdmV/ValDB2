'''
Campaign model
'''
from datetime import datetime
from collections import deque

from models.report import Report
from core import Model
from core.validation import regex, required, unique

CAMPAIGN_NAME_FORMAT = r'[0-9]{1,3}_[0-9]{1,3}_[0-9]{1,3}.{0,20}'


class Campaign(Model):
    '''
    Campaign model
    '''
    name: str
    description: str
    deadline: datetime
    target_release: str
    reference_release: str
    relmon: str
    subcategories: list[str]
    reports: list[Report]
    is_open: bool
    latest_activities: deque[tuple[str, datetime]]

    MAX_LASTEST_ACTIVITY_QUEUE = 5

    _validation = {
        'name': [required(), regex(CAMPAIGN_NAME_FORMAT), unique()],
        'subcategories': [required()],
    }

    @classmethod
    def get_by_name(cls, campaign_name):
        '''
        Get campaign by name
        '''
        return cls.query_one({'name': campaign_name})
