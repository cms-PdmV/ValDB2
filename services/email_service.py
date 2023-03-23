"""
Email Service
"""
import os
from email.message import EmailMessage
import logging
import smtplib

_logger = logging.getLogger("service.email")
enable_to_production = os.getenv("PRODUCTION")
dev_recipients = ["pdmvserv@cern.ch"]


class EmailService:
    """
    Email service
    """

    __smtp_host = os.getenv("EMAIL_SERVER", "smtp.cern.ch")
    __smtp_port = int(os.getenv("EMAIL_PORT", "587"))
    __smtp_user = os.getenv("EMAIL_ADDRESS")
    __smtp_password = os.getenv("EMAIL_PASSWORD")

    @staticmethod
    def send(subject, body, recipients):
        """
        Send email
        """
        if not enable_to_production:
            _logger.warning("[DEV] Original recipients: %s", recipients)
            _logger.warning("[DEV] Override recipients to: %s", dev_recipients)
            recipients = dev_recipients
            subject = f"[DEV]{subject}"

        message = EmailMessage()
        body = body.strip()
        message.set_content(body, subtype="html")
        message["Subject"] = subject
        message["From"] = EmailService.__smtp_user
        message["To"] = ", ".join(recipients)
        message["Cc"] = "pdmvserv@cern.ch"

        smtp = smtplib.SMTP(
            host=EmailService.__smtp_host, port=EmailService.__smtp_port
        )
        smtp.starttls()
        smtp.login(user=EmailService.__smtp_user, password=EmailService.__smtp_password)
        _logger.info("Sending email %s to %s", message["Subject"], message["To"])
        smtp.send_message(message)
        smtp.quit()
