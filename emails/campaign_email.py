from models.campaign import Campaign
from emails.template import EmailTemplate, render_template

class NewCampaignEmailTemplate(EmailTemplate):
    '''
    New campaign has been created
    Subject: [ValDB][1_2_3_abc] New campaign is now open 
    Recipients: forum
    Template: new_campaign_template.html
    '''
    def build(self, campaign: Campaign):
        return self

class SignOffCampaignEmailTemplate(EmailTemplate):
    '''
    Campaign has been sign off
    Subject: [ValDB][1_2_3_abc] Campaign has been signed off
    Recipients: forum
    Template: sign_off_campaign_template.html
    '''
    def build(self, campaign: Campaign):
        return self