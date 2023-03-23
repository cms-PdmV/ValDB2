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

    @staticmethod
    def send(subject, body, recipients):
        """
        Send email
        """
        if not enable_to_production:
            _logger.warning("[DEV] Original recipients: %s", recipients)
            _logger.warning("[DEV] Override recipients to: %s", dev_recipients)
            recipients = dev_recipients
            subject = f"[DEV] {subject}"

        message = EmailMessage()
        body = body.strip()
        message.set_content(body, subtype="html")
        message["Subject"] = subject
        message["From"] = "PdmV Service Account <pdmvserv@cern.ch>"
        message["To"] = ", ".join(recipients)
        message["Cc"] = "pdmvserv@cern.ch"

        smtp = smtplib.SMTP()
        smtp.connect()
        _logger.info("Sending email %s to %s", message["Subject"], message["To"])
        smtp.send_message(message)
        smtp.quit()
