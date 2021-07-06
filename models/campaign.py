from models.report import Report
from core import Model
from datetime import datetime

class Campaign(Model):
    name: str
    description: str
    deadline: datetime
    target_release: str
    reference_release: str
    subcategories: list[str]
    reports: list[Report]
    active: bool

    @classmethod
    def get_by_name(cls, campaign_name):
        result = cls.query({'name': campaign_name})
        if len(result) == 0:
            return None
        camapign = result[0]
        return camapign