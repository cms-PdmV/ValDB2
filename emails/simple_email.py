from emails.template import EmailTemplate, render_template

SIMPLE_TEMPLATE = './templates/simple_template.html'

class SimpleEmailTempalte(EmailTemplate):
    def build(self, content='', subject=''):
        self.subject = f'[TEST] {subject}'
        self.recipients = ['wic.chanchana@gmail.com']
        self.body = render_template(SIMPLE_TEMPLATE, content=content)
