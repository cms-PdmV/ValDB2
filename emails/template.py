'''
Email template base model
'''
from services.email import EmailService

class EmailAddress:
    forum = 'hn-cms-relval@cern.ch'
    dev = 'chanchana.wicha@cern.ch'

def format_new_line(html):
    '''
    Convert \n to <br>
    '''
    return html.replace('\n', '<br>')

def render_template(template_path, **kwargs):
    '''
    Render HTML email template and fill information
    '''
    with open(template_path) as f:
        html_template = f.read()
        for key, value in kwargs.items():
            html_template = html_template.replace(f'{{{{{key}}}}}', value)
        return html_template

class EmailTemplate:
    '''
    Base email template
    '''
    def __init__(self, subject='', body='', recipients='') -> None:
        self.subject = subject
        self.body = body
        self.recipients = recipients
    
    def build(self):
        '''
        Build email
        '''
        return self

    def send(self):
        '''
        Send email via email service
        '''
        EmailService.send(self.subject, self.body, self.recipients)
