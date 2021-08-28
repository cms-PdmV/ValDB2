from services.email import EmailService
from core import TestCase
from emails.template import EmailTemplate, EmailAddress, render_template

class TestEmailTemplate(EmailTemplate):
    def __init__(self, title, detail) -> None:
        self.subject = f'TEST:{title}'
        self.body = f'DETAIL:{detail}'
        self.recipients = [EmailAddress.forum]

class EmailTest(TestCase):

    def test_email_template(self):
        def send_mock(subject, body, recipients):
            self.assertEqual(subject, 'TEST:title')
            self.assertEqual(body, 'DETAIL:detail')
            self.assertEqual(recipients, [EmailAddress.forum])

        EmailService.send = send_mock
        TestEmailTemplate(title='title', detail='detail').send()

    def test_render_template(self):
        rendered = render_template('/Users/chanchana/CERN/ValDB2/emails/templates/simple_template.html', content='This is test')
        self.assertIn('This is test', rendered)