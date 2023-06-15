"""
Email Service
"""
import os
from email.message import EmailMessage
from utils.email_content import EmailAddress
import logging
import smtplib

_logger = logging.getLogger("service.email")
enable_to_production = os.getenv("PRODUCTION")
custom_dev_subject_header = os.getenv("DEV_SUBJECT_HEADER")


class EmailService:
    """
    Email service
    """

    __smtp_host = os.getenv("EMAIL_SERVER", "cernmx.cern.ch")
    __smtp_port = int(os.getenv("EMAIL_PORT", "25"))
    __smtp_user = os.getenv("EMAIL_ADDRESS")
    __smtp_password = os.getenv("EMAIL_PASSWORD")
    __smtp_auth_required = os.getenv("EMAIL_AUTH_REQUIRED")

    @staticmethod
    def send(
        subject,
        body,
        recipients,
        original_element_email_id=None,
        new_email_id_for_reply=None,
        notification_references=None,
    ):
        """
        Send email
        """
        if not enable_to_production:
            _logger.debug("[DEV] Original recipients: %s", recipients)
            if custom_dev_subject_header:
                _logger.debug(
                    "[DEV] Using a custom header for the subject: %s",
                    custom_dev_subject_header,
                )
                subject = f"[{custom_dev_subject_header}]{subject}"
            else:
                subject = f"[DEV]{subject}"

        message = EmailMessage()
        body = body.strip()
        message.set_content(body, subtype="html")
        message["Subject"] = subject
        message["From"] = EmailService.__smtp_user
        message["To"] = ", ".join(recipients)
        message["Cc"] = "pdmvserv@cern.ch"

        reply_to_addresses = [EmailService.__smtp_user, EmailAddress.forum]
        message["Reply-To"] = ", ".join(reply_to_addresses)

        # If this email is a reply for a sent message
        # append the references
        if original_element_email_id and new_email_id_for_reply:
            message["In-Reply-To"] = original_element_email_id
            message["Message-ID"] = new_email_id_for_reply

        if notification_references:
            message["References"] = ", ".join(notification_references[-3:-1])

        smtp = smtplib.SMTP(
            host=EmailService.__smtp_host, port=EmailService.__smtp_port
        )
        smtp.starttls()
        if EmailService.__smtp_auth_required:
            smtp.login(
                user=EmailService.__smtp_user, password=EmailService.__smtp_password
            )
        _logger.info("Sending email %s to %s", message["Subject"], message["To"])
        smtp.send_message(message)
        smtp.quit()
