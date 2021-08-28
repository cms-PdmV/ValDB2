from models.campaign import Campaign
from emails.template import EmailAddress, EmailTemplate, render_template

OPEN_CAMPAIGN_TEMPLATE = 'emails/templates/open_campaign_template.html'
SIGN_OFF_CAMPAIGN_TEMPLATE = 'emails/templates/sign_off_campaign_template.html'

class OpenCampaignEmailTemplate(EmailTemplate):
    '''
    Campaign is now open, create
    Subject: [ValDB][1_2_3_abc] Campaign is now open
    Recipients: forum
    Template: open_campaign_template.html
    '''
    def build(self, campaign: Campaign):
        self.subject = f'[ValDB][{campaign.name}] Campaign is now open'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [EmailAddress.forum]
        return self

class SignOffCampaignEmailTemplate(EmailTemplate):
    '''
    Campaign has been sign off
    Subject: [ValDB][1_2_3_abc] Campaign has been signed off
    Recipients: forum
    Template: sign_off_campaign_template.html
    '''
    def build(self, campaign: Campaign):
        self.subject = f'[ValDB][{campaign.name}] Campaign has been signed off'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [EmailAddress.forum]
        return self