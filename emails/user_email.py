from models.user import User
from emails.template import EmailAddress, EmailTemplate, render_template

CHANGE_USER_ROLE_TEMPLATE = 'emails/templates/change_user_role_template.html'
CHANGE_USER_PERMISSION_TEMPLATE = 'emails/templates/change_user_permission_template.html'

class ChangeUserRoleEmailTemplate(EmailTemplate):
    '''
    User role has been modified
    Subject: [ValDB] Your role has been modified
    Recipients: target user
    Template: change_user_role_template.html
    '''
    def build(self, user: User):
        self.subject = f'[ValDB] Your role has been modified'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [user.email]
        return self

class ChangeUserPermissionEmailTemplate(EmailTemplate):
    '''
    User permission group has been modified
    Subject: [ValDB] Your permission group has been modified
    Recipients: target user
    Template: change_user_permission_template.html
    '''
    def build(self, user: User):
        self.subject = f'[ValDB] Your permission group has been modified'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [user.email]
        return self