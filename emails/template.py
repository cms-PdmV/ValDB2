"""
Email template base model
"""
from services.email_service import EmailService
from models.report import Report
from utils.email_content import EmailAddress
from typing import List


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
            html_template = html_template.replace(f"{{{{{key}}}}}", value)
        return html_template


class EmailTemplate:
    """
    Base email template
    """

    def __init__(
        self,
        subject="",
        body="",
        recipients="",
        original_element_email_id=None,
        new_email_id_for_reply=None,
        notification_references=None,
    ) -> None:
        self.subject = subject
        self.body = body
        self.recipients = recipients
        self.original_element_email_id = original_element_email_id
        self.new_email_id_for_reply = new_email_id_for_reply
        self.notification_references = notification_references

    def __get_author_emails(self, report: Report):
        """
        Get authors
        """
        return [author.email for author in report.authors]

    def __get_related_emails(self, report: Report):
        """
        Get related email: authors, commentor
        """
        activity_user_emails = [activity.user.email for activity in report.activities]
        author_emails = self.__get_author_emails(report)
        return list(set(activity_user_emails + author_emails))

    def __send_notification_to_trigger(self, report: Report) -> List[str]:
        group = report.get_group_components()
        if group.category == "HLT":
            return [EmailAddress.forum_trigger]
        return []

    def __send_notification_to_reco_muon(self, report: Report) -> List[str]:
        group = report.get_group_components()
        if group.category == "Reconstruction" and group.pwg == "Muon":
            return [EmailAddress.forum_reco_muon]
        return []

    def __send_extra_notifications(self, report: Report) -> List[str]:
        return list(
            set(
                self.__send_notification_to_trigger(report=report)
                + self.__send_notification_to_reco_muon(report=report)
            )
        )

    def get_email_recipients_for_report(
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

        # Forums for extra notifications
        extra_notifications = self.__send_extra_notifications(report=report)

        # Build final recipient list
        all_recipients += default_forum + related_authors + extra_notifications
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
            original_element_email_id=self.original_element_email_id,
            new_email_id_for_reply=self.new_email_id_for_reply,
            notification_references=self.notification_references,
        )
