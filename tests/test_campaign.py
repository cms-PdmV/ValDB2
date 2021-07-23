from models.campaign import Campaign
from core import TestCase
from api.campaign import CampaignAPI

class CampaignTest(TestCase):

    def test_get_return_correct_groups(self):
        campaign = Campaign({
            'subcategories': ['Reconstruction.Data', 'Reconstruction.FullSim', 'GEN.Gen'],
            'reports': []
        }).save()
        api = CampaignAPI()
        result = api.get(campaign.name)

        self.assertEqual(len(result['groups']), 2)
        self.assertEqual(result['groups'][0]['category'], 'Reconstruction')
        self.assertEqual(len(result['groups'][0]['subcategories']), 2)
        self.assertEqual(result['groups'][0]['subcategories'][0]['subcategory'], 'Data')
