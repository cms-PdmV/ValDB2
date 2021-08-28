from emails.template import EmailTemplate, render_template

SIMPLE_TEMPLATE = 'emails/templates/simple_template.html'

class SimpleEmailTemplate(EmailTemplate):
    def build(self, content='', subject=''):
        self.subject = f'[TEST] {subject}'
        self.recipients = ['wic.chanchana@gmail.com']
        self.body = render_template(SIMPLE_TEMPLATE, content=content)
        return self


from emails.simple_email import SimpleEmailTemplate
SimpleEmailTemplate().build(content='<br>abc', subject='cern 1').send()