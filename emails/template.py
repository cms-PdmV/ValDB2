"""
Email template base model
"""
import os
from services.email_service import EmailService


class EmailAddress:
    """
    Common email address
    """

    enable_to_production = os.getenv("PRODUCTION")
    cms_talk = "cmstalk+relval@dovecotmta.cern.ch"
    dev_forum = "pdmvserv@cern.ch"
    forum = cms_talk if enable_to_production else dev_forum


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

    def __init__(self, subject="", body="", recipients="") -> None:
        self.subject = subject
        self.body = body
        self.recipients = recipients

    def send(self):
        """
        Send email via email service
        """
        EmailService.send(self.subject, self.body, self.recipients)
