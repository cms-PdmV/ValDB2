"""
Email service module. It provides the functionality
to send email notifications mainly used to report
updates into CMS Talk

Attributes:
    _logger (logging.Logger): Logger instance to report the status
        of actions related with this service
    enable_to_production (Optional[str]): If enabled, this flag
        is used to configure the email headers to use the production format
        Otherwise, it will append a prefix stating the email was intended to be
        send as part of a test (DEV) or Demo
    custom_dev_subject_header (Optional[str]): If provided, this will override 
        the header for emails in development environment (:= not enable_to_production)
"""
import os
from email.message import EmailMessage
from utils.email_content import EmailAddress
from email.utils import make_msgid
from typing import List, Optional
import logging
import smtplib

_logger: logging.Logger = logging.getLogger("service.email")
enable_to_production: Optional[str] = os.getenv("PRODUCTION")
custom_dev_subject_header: Optional[str] = os.getenv("DEV_SUBJECT_HEADER")


class EmailService:
    """
    Email Service. This class offers the support required to
    send emails via SMTP protocol.

    Attributes:
        __smtp_host (str): Email gateway server to send the email
        __smtp_port (int): Email gateway server port
        __smtp_auth_required (Optional[str]): If provided, authenticate
            the SMTP client against the email gateway server
        __smtp_user (str): If it is require to authenticate,
            this user will be used to perform a basic authentication
        __smtp_password (str): If it is require to authenticate,
            this password will be used to perform a basic authentication
    """

    __smtp_host: str = os.getenv("EMAIL_SERVER", "cernmx.cern.ch")
    __smtp_port: int = int(os.getenv("EMAIL_PORT", "25"))
    __smtp_user: str = os.getenv("EMAIL_ADDRESS", "")
    __smtp_password: str = os.getenv("EMAIL_PASSWORD", "")
    __smtp_auth_required: Optional[str] = os.getenv("EMAIL_AUTH_REQUIRED")

    @staticmethod
    def send(
        subject: str,
        body: str,
        recipients: List[str],
        original_email_id: str,
        email_id: Optional[str] = make_msgid(),
    ):
        """
        Send an email via the email gateway server

        Args:
            subject (str): Email subject
            body (str): Email body
            recipients: (List[str]): List of recipients' e-mail addresses
            original_email_id (str): Message-ID used to link this message as a reply to an existing message
            email_id (Optional[str]): Message-ID for the email to be send. If it is not provided, a new Message-ID will be created
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
        if original_email_id:
            message["In-Reply-To"] = original_email_id

        message["Message-ID"] = email_id if email_id else make_msgid()

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
