from models.campaign import Campaign
from emails.template import EmailTemplate, render_template

class ModifyReportEmailTemplate(EmailTemplate):
    '''
    Report of group is modified
    Subject: [ValDB][1_2_3_abc][Reconstruction.Data.Tracker] Report has been modified
    Recipients: forum, report's authors
    Template: modify_report_template.html
    '''
    def build(self, campaign: Campaign):
        return self

class ChangeStatusReportEmailTemplate(EmailTemplate):
    '''
    Report's status is modified
    Subject: [ValDB][1_2_3_abc][Reconstruction.Data.Tracker] Report's status has been changed
    Recipients: forum, report's authors
    Template: change_status_campaign_template.html
    '''
    def build(self, campaign: Campaign):
        return self

class NewCommentReportEmailTemplate(EmailTemplate):
    '''
    New comment has been added to the report
    Subject: [ValDB][1_2_3_abc][Reconstruction.Data.Tracker] New comment
    Recipients: forum, report's authors, related users
    Template: change_status_campaign_template.html
    '''
    def build(self, campaign: Campaign):
        return self