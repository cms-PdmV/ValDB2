from models.report import Report
from models.user import User
from core import Model
from datetime import datetime

campaign_prefix = 'CMP'

class Campaign(Model):
    id: str
    name: str
    description: str
    deadline: datetime
    target_release: str
    reference_release: str
    subcategories: list[str]
    reports: list[Report]
    active: bool

    # def create(self):
    #     campaign_id = f'{campaign_prefix}-{self._database.count(self._get_collection_name()) + 1}'
    #     self.id = campaign_id
    #     return self.save()

    @classmethod
    def get_by_name(cls, campaign_name):
        result = cls.query({'name': campaign_name})
        if len(result) == 0:
            return None
        camapign = result[0]
        return camapign