"""
Email Service
"""
import logging
import smtplib
from email.message import EmailMessage

_logger = logging.getLogger('service.email')

class EmailService():
    """
    Email service
    """

    @staticmethod
    def send(subject, body, recipients):
        """
        Send email
        """
        message = EmailMessage()
        body = body.strip()
        message.set_content(body, subtype='html')
        message['Subject'] = subject
        message['From'] = 'PdmV Service Account <pdmvserv@cern.ch>'
        message['To'] = ', '.join(recipients)
        message['Cc'] = 'pdmvserv@cern.ch'

        smtp = smtplib.SMTP()
        smtp.connect()
        _logger.info('Sending email %s to %s', message['Subject'], message['To'])
        smtp.send_message(message)
        smtp.quit()