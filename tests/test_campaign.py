from models.campaign import Campaign
from core import TestCase
from api.campaign import CampaignAPI

class CampaignTest(TestCase):

    def test_get(self):
        campaign = Campaign({
            'subcategories': ['Reconstruction.Data', 'Reconstruction.FullSim', 'GEN.Gen'],
            'reports': []
        }).create()
        api = CampaignAPI()
        result = api.get(campaign.id)

        print(result)
        # TODO: assert