from services.email import EmailService

class EmailAddress:
    forum = 'hn-cms-relval@cern.ch'
    dev = 'chanchana.wicha@cern.ch'

def render_template(template_path, **kwargs):
    with open(template_path) as f:
        html_template = f.read()
        for key, value in kwargs.items():
            html_template = html_template.replace(f'{{{{{key}}}}}', value)
        return html_template

class EmailTemplate:

    def __init__(self, subject='', body='', recipients='') -> None:
        self.subject = subject
        self.body = body
        self.recipients = recipients

    def send(self):
        EmailService.send(self.subject, self.body, self.recipients)
