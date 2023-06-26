"""
Email template base model
"""
from services.email_service import EmailService
from models.report import Report
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

    def send_for_report(self, report: Report, include_commentors: bool = False):
        """
        Send a notification related to the reports.
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

        # Send an email to each extra category
        for category_forum_email in self.__send_extra_notifications(report=report):
            EmailService.send(
                subject=self.subject,
                body=self.body,
                recipients=[category_forum_email],
                original_email_id=self.original_email_id,
            )
