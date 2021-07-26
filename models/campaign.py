'''
Campaign model
'''
from datetime import datetime

from models.report import Report
from core import Model

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
    active: bool

    @classmethod
    def get_by_name(cls, campaign_name):
        '''
        Get campaign by name
        '''
        result = cls.query({'name': campaign_name})
        if len(result) == 0:
            return None
        camapign = result[0]
        return camapign
