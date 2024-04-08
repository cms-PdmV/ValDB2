"""
Email template base model
"""
from services.email_service import EmailService
from models.report import Report
from models.campaign import Campaign
from utils.email_content import EmailAddress
from typing import List, Optional


def format_new_line(html):
    """
    Convert \n to <br>
    """
    return html.replace("\n", "<br>")


def render_template(template_path, **kwargs):
    """
    Render HTML email template and fill information
    """
    with open(template_path, encoding="utf-8") as file:
        html_template = file.read()
        for key, value in kwargs.items():
            value = value or "Not provided"
            html_template = html_template.replace(f"{{{{{key}}}}}", value)
        return html_template


class EmailTemplate:
    """
    Base email template
    """

    def __init__(
        self,
        subject: str = "",
        body: str = "",
        recipients: List[str] = [],
        original_email_id: str = "",
        email_id: Optional[str] = None,
    ) -> None:
        self.subject = subject
        self.body = body
        self.recipients = recipients
        self.original_email_id = original_email_id
        self.email_id = email_id

    def __get_author_emails(self, report: Report) -> List[str]:
        """
        Get authors
        """
        return [author.email for author in report.authors]

    def __get_related_emails(self, report: Report) -> List[str]:
        """
        Get related email: authors, commentor
        """
        activity_user_emails = [activity.user.email for activity in report.activities]
        author_emails = self.__get_author_emails(report)
        return list(set(activity_user_emails + author_emails))

    def __get_email_recipients_for_report(
        self, report: Report, include_commentors=False
    ) -> List[str]:
        """
        Return the recipients for an email notification considering
        some special cases when it is required to forward a notification
        to more than one channel in CMS Talk
        """
        all_recipients: List[str] = []

        # Append the default CMS Talk forum
        default_forum = [EmailAddress.forum]

        # Append all the report authors and commentors
        related_authors = (
            self.__get_related_emails(report=report)
            if include_commentors
            else self.__get_author_emails(report=report)
        )

        # Build final recipient list
        all_recipients += default_forum + related_authors
        all_recipients = list(set(all_recipients))
        all_recipients = [r for r in all_recipients if r]

        return all_recipients

    def send(self):
        """
        Send email via email service
        """
        EmailService.send(
            subject=self.subject,
            body=self.body,
            recipients=self.recipients,
            original_email_id=self.original_email_id,
            email_id=self.email_id,
        )

    def send_campaign_notification(
        self, campaign: Campaign, open_campaign: bool = False
    ):
        """
        Send a notification related to campaign entity: New opened campaign or
        a signed off notification.

        Args:
            campaign (Campaign): Campaign to send an email notification
            open_campaign (bool): Indicates if this emails is the first notification
                sent. It is related to the open campaign message.
        """
        EmailService.send(
            subject=self.subject,
            body=self.body,
            recipients=self.recipients,
            original_email_id=self.original_email_id,
            email_id=self.email_id,
        )

        try:
            send_to_trigger_channel: bool = campaign.notification_to_trigger()
            send_to_reconstruction_channel: bool = (
                campaign.notification_to_reconstruction()
            )
            email_id_extra_channels: dict = campaign.channel_email_id

            if send_to_trigger_channel:
                channel_email_id: str = email_id_extra_channels.get("cms_talk_trigger")
                if channel_email_id:
                    EmailService.send(
                        subject=self.subject,
                        body=self.body,
                        recipients=[EmailAddress.forum_trigger],
                        original_email_id=channel_email_id,
                        email_id=channel_email_id if open_campaign else None,
                    )

            if send_to_reconstruction_channel:
                channel_email_id: str = email_id_extra_channels.get(
                    "cms_talk_reco_muon"
                )
                if channel_email_id:
                    EmailService.send(
                        subject=self.subject,
                        body=self.body,
                        recipients=[EmailAddress.forum_reco_muon],
                        original_email_id=channel_email_id,
                        email_id=channel_email_id if open_campaign else None,
                    )

        except AttributeError:
            # Current campaign does not have Message-ID identifiers to send
            # emails to other channels. Supress the exception and do not send
            # the message
            pass

    def send_report_notification(
        self, report: Report, campaign: Campaign, include_commentors: bool = False
    ):
        """
        Send a notification related to a reports and group its content under the Campaign post.
        Send an e-mail notification to each of the additional categories that need to be notified.
        """
        # Send an email to the main forum
        EmailService.send(
            subject=self.subject,
            body=self.body,
            recipients=self.__get_email_recipients_for_report(
                report=report, include_commentors=include_commentors
            ),
            original_email_id=self.original_email_id,
            email_id=self.email_id,
        )

        try:
            send_to_trigger_channel: bool = report.notification_to_trigger()
            send_to_reconstruction_channel: bool = (
                report.notification_to_reconstruction()
            )
            email_id_extra_channels: dict = campaign.channel_email_id

            if send_to_trigger_channel:
                channel_email_id: str = email_id_extra_channels.get("cms_talk_trigger")
                if channel_email_id:
                    EmailService.send(
                        subject=self.subject,
                        body=self.body,
                        recipients=[EmailAddress.forum_trigger],
                        original_email_id=channel_email_id,
                    )

            if send_to_reconstruction_channel:
                channel_email_id: str = email_id_extra_channels.get(
                    "cms_talk_reco_muon"
                )
                if channel_email_id:
                    EmailService.send(
                        subject=self.subject,
                        body=self.body,
                        recipients=[EmailAddress.forum_reco_muon],
                        original_email_id=channel_email_id,
                    )

        except AttributeError:
            # Current campaign does not have Message-ID identifiers to send
            # emails to other channels. Supress the exception and do not send
            # the message
            pass
