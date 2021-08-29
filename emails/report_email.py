import markdown

from utils.datetime import format_datetime
from models.activity import Activity
from models.report import Report, REPORT_STATUS_LABEL, ReportStatus
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
        # self.recipients = [EmailAddress.forum] + get_author_emails(report)
        self.body = render_template(MODIFY_REPORT_TEMPLATE,
            campaign_name=report.campaign_name,
            group=group_label(report.group),
            status=REPORT_STATUS_LABEL[ReportStatus(report.status)],
            authors=', '.join([user.fullname for user in report.authors]),
            updated_at_string=format_datetime(report.updated_at),
            content=markdown.markdown(report.content)
        )
        # TODO: remove debug print
        print('Email Event')
        print(self.subject)
        print([EmailAddress.forum] + get_author_emails(report))
        return self

class ChangeStatusReportEmailTemplate(EmailTemplate):
    '''
    Report's status is modified
    Subject: [ValDB][1_2_3_abc][Reconstruction.Data.Tracker] Report's status has been changed
    Recipients: forum, report's authors
    Template: change_status_report_template.html
    '''
    def build(self, report: Report, previous_status: ReportStatus):
        self.subject = f'[ValDB][{report.campaign_name}][{group_label(report.group)}] Report\'s status has been changed'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [EmailAddress.forum] + get_author_emails(report)
        self.body = render_template(CHANGE_STATUS_REPORT_TEMPLATE,
            campaign_name=report.campaign_name,
            group=group_label(report.group),
            old_status=REPORT_STATUS_LABEL[ReportStatus(previous_status)],
            new_status=REPORT_STATUS_LABEL[ReportStatus(report.status)],
            authors=', '.join([user.fullname for user in report.authors]),
            updated_at_string=format_datetime(report.updated_at)
        )
        # TODO: remove debug print
        print('Email Event')
        print(self.subject)
        print([EmailAddress.forum] + get_author_emails(report))
        return self

class NewCommentReportEmailTemplate(EmailTemplate):
    '''
    New comment has been added to the report
    Subject: [ValDB][1_2_3_abc][Reconstruction.Data.Tracker] New comment
    Recipients: forum, report's authors, related users
    Template: new_comment_report_template.html
    '''
    def build(self, report: Report, activity: Activity):
        self.subject = f'[ValDB][{report.campaign_name}][{group_label(report.group)}] New comment'
        self.recipients = [EmailAddress.dev] # TODO: change to actual
        # self.recipients = [EmailAddress.forum] + get_related_emails(report)
        self.body = render_template(NEW_COMMENT_REPORT_TEMPLATE,
            campaign_name=report.campaign_name,
            group=group_label(report.group),
            status=REPORT_STATUS_LABEL[ReportStatus(report.status)],
            authors=', '.join([user.fullname for user in report.authors]),
            updated_at_string=format_datetime(report.updated_at),
            comment_created_at_string=format_datetime(activity.created_at),
            user_fullname=activity.user.fullname,
            user_email=activity.user.email,
            comment=activity.content,
        )
        # TODO: remove debug print
        print('Email Event')
        print(self.subject)
        print([EmailAddress.forum] + get_related_emails(report))
        return self