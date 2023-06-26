"""
Campaign Emails
"""
from models.campaign import Campaign
from emails.template import (
    EmailTemplate,
    render_template,
    format_new_line,
)
from utils.datetime import format_datetime
from utils.email_content import EmailAddress

OPEN_CAMPAIGN_TEMPLATE = "emails/templates/open_campaign_template.html"
SIGN_OFF_CAMPAIGN_TEMPLATE = "emails/templates/sign_off_campaign_template.html"


class OpenCampaignEmailTemplate(EmailTemplate):
    """
    Campaign is now open, create
    Subject: [ValDB][1_2_3_abc] Campaign is now open
    Recipients: forum
    Template: open_campaign_template.html
    """

    def build(self, campaign: Campaign):
        """
        build email
        """
        self.original_email_id = campaign.first_email_id
        # This is the first email, we will attach all the notifications below it
        self.email_id = campaign.first_email_id
        self.subject = f"[ValDB][{campaign.name}] Campaign is now open"
        self.recipients = [EmailAddress.forum]
        self.body = render_template(
            OPEN_CAMPAIGN_TEMPLATE,
            name=campaign.name,
            target_release=campaign.target_release,
            reference_release=campaign.reference_release,
            target_groups=", ".join(campaign.subcategories),
            deadline_string=format_datetime(campaign.deadline),
            created_at_string=format_datetime(campaign.created_at),
            description=format_new_line(campaign.description),
        )
        return self


class SignOffCampaignEmailTemplate(EmailTemplate):
    """
    Campaign has been sign off
    Subject: [ValDB][1_2_3_abc] Campaign has been signed off
    Recipients: forum
    Template: sign_off_campaign_template.html
    """

    def build(self, campaign: Campaign):
        """
        build email
        """
        self.original_email_id = campaign.first_email_id
        self.subject = f"[ValDB][{campaign.name}] Campaign has been signed off"
        self.recipients = [EmailAddress.forum]
        self.body = render_template(
            SIGN_OFF_CAMPAIGN_TEMPLATE,
            name=campaign.name,
            target_release=campaign.target_release,
            reference_release=campaign.reference_release,
            target_groups=", ".join(campaign.subcategories),
            deadline_string=format_datetime(campaign.deadline),
            updated_at_string=format_datetime(campaign.updated_at),
            description=format_new_line(campaign.description),
        )
        return self
