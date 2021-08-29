from models.user import USER_ROLE_LABEL, User, UserRole
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
        self.body = render_template(CHANGE_USER_ROLE_TEMPLATE,
            role=USER_ROLE_LABEL[UserRole(user.role)]
        )
        # TODO: remove debug print
        print('Email Event')
        print(self.subject)
        print([user.email])
        return self

class ChangeUserPermissionEmailTemplate(EmailTemplate):
    '''
    User permission group has been modified
    Subject: [ValDB] Your permission group has been modified
    Recipients: target user
    Template: change_user_permission_template.html
    '''
    def build(self, user: User, action: str, group: str):
        self.subject = f'[ValDB] Your permission group has been modified'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [user.email]
        self.body = render_template(CHANGE_USER_PERMISSION_TEMPLATE,
            action='added' if action == 'add' else 'removed',
            prep='to' if action == 'add' else 'from',
            group=group
        )
        # TODO: remove debug print
        print('Email Event')
        print(self.subject)
        print([user.email])
        return self