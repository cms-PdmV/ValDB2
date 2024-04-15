"""
Report emails
"""

import markdown

from utils.datetime import format_datetime
from utils.email_content import parse_attachment_links
from models.activity import Activity
from models.report import Report, REPORT_STATUS_LABEL, ReportStatus
from models.campaign import Campaign
from emails.template import (
    EmailTemplate,
    render_template,
    format_new_line,
)

REPORT_TEMPLATE = "emails/templates/report_template.html"
NEW_COMMENT_REPORT_TEMPLATE = "emails/templates/new_comment_report_template.html"


def group_label(group_path_string):
    """
    Label text of group path
    """
    return group_path_string.replace(".", " / ")


class ReportEmailTemplate(EmailTemplate):
    """
    Report is modified
    Subject: [ValDB][1_2_3_abc] Campaign notification
    Recipients: forum, report's authors
    Template: report_template.html

    Use the same subject to group all emails under the same thread
    """

    def build(
        self, report: Report, previous_status: ReportStatus, report_campaign: Campaign
    ):
        """
        build email
        """
        self.original_email_id = report_campaign.reference_email_id
        self.subject = f"[ValDB][{report.campaign_name}] Campaign notification"
        content_markdown_no_links = parse_attachment_links(content=report.content)
        self.body = render_template(
            REPORT_TEMPLATE,
            campaign_name=report.campaign_name,
            group=group_label(report.group),
            old_status=REPORT_STATUS_LABEL[ReportStatus(previous_status)],
            new_status=REPORT_STATUS_LABEL[ReportStatus(report.status)],
            authors=", ".join([user.fullname for user in report.authors]),
            updated_at_string=format_datetime(report.updated_at),
            content=format_new_line(markdown.markdown(content_markdown_no_links)),
        )
        return self


class NewCommentReportEmailTemplate(EmailTemplate):
    """
    New comment has been added to the report
    Subject: [ValDB][1_2_3_abc] Campaign notification
    Recipients: forum, report's authors, related users
    Template: new_comment_report_template.html

    Use the same subject to group all emails under the same thread
    """

    def build(self, report: Report, activity: Activity, report_campaign: Campaign):
        """
        build email
        """
        self.original_email_id = report_campaign.reference_email_id
        self.subject = f"[ValDB][{report.campaign_name}] Campaign notification"
        self.body = render_template(
            NEW_COMMENT_REPORT_TEMPLATE,
            campaign_name=report.campaign_name,
            group=group_label(report.group),
            status=REPORT_STATUS_LABEL[ReportStatus(report.status)],
            authors=", ".join([user.fullname for user in report.authors]),
            updated_at_string=format_datetime(report.updated_at),
            comment_created_at_string=format_datetime(activity.created_at),
            user_fullname=activity.user.fullname,
            user_email=activity.user.email,
            comment=activity.content,
        )
        return self
