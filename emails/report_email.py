from models.report import Report
from emails.template import EmailAddress, EmailTemplate, render_template

MODIFY_REPORT_TEMPLATE = 'emails/templates/modify_report_template.html'
CHANGE_STATUS_REPORT_TEMPLATE = 'emails/templates/change_status_report_template.html'
NEW_COMMENT_REPORT_TEMPLATE = 'emails/templates/new_comment_report_template.html'

def get_author_emails(report: Report):
    return [author.email for author in report.authors]

def get_related_emails(report: Report):
    activity_user_emails = [activity.user.email for activity in report.activities]
    author_emails = get_author_emails(report)
    return list(set(activity_user_emails + author_emails))

def group_label(group_path_string):
    return group_path_string.replace('.', ' / ')

class ModifyReportEmailTemplate(EmailTemplate):
    '''
    Report of group is modified
    Subject: [ValDB][1_2_3_abc][Reconstruction.Data.Tracker] Report has been modified
    Recipients: forum, report's authors
    Template: modify_report_template.html
    '''
    def build(self, report: Report):
        self.subject = f'[ValDB][{report.campaign_name}][{group_label(report.group)}] Report has been modified'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [EmailAddress.dev] + get_author_emails(report)
        return self

class ChangeStatusReportEmailTemplate(EmailTemplate):
    '''
    Report's status is modified
    Subject: [ValDB][1_2_3_abc][Reconstruction.Data.Tracker] Report's status has been changed
    Recipients: forum, report's authors
    Template: change_status_report_template.html
    '''
    def build(self, report: Report):
        self.subject = f'[ValDB][{report.campaign_name}][{group_label(report.group)}] Report\'s status has been changed'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [EmailAddress.dev] + get_author_emails(report)
        return self

class NewCommentReportEmailTemplate(EmailTemplate):
    '''
    New comment has been added to the report
    Subject: [ValDB][1_2_3_abc][Reconstruction.Data.Tracker] New comment
    Recipients: forum, report's authors, related users
    Template: new_comment_report_template.html
    '''
    def build(self, report: Report):
        self.subject = f'[ValDB][{report.campaign_name}][{group_label(report.group)}] New comment'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [EmailAddress.dev] + get_related_emails(report)
        return self