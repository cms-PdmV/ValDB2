from models.campaign import User
from emails.template import EmailTemplate, render_template

class ChangeUserRoleEmailTemplate(EmailTemplate):
    '''
    User role has been modified
    Subject: [ValDB] Your role has been modified
    Recipients: target user
    Template: change_user_role_template.html
    '''
    def build(self, user: User):
        return self

class ChangeUserPermissionEmailTemplate(EmailTemplate):
    '''
    User permission group has been modified
    Subject: [ValDB] Your permission group has been modified
    Recipients: target user
    Template: change_user_group_template.html
    '''
    def build(self, user: User):
        return self