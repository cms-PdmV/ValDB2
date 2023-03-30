"""
Some auxiliary functions
to parse markdown content before
transform it into HTML
"""
import os
import re

MARKDOWN_ATTACHMENT = r"!\[(.*?)\]\((.*?)\)"
markdown_parser = re.compile(MARKDOWN_ATTACHMENT)


class EmailAddress:
    """
    Common email address
    """

    enable_to_production = os.getenv("PRODUCTION")
    cms_talk = "cmstalk+relval@dovecotmta.cern.ch"
    dev_forum = "cmstalk+test@dovecotmta.cern.ch"
    # dev_forum = "pdmvserv@cern.ch"
    forum = cms_talk if enable_to_production else dev_forum


def parse_attachment_links(content: str, reference_placeholder=True):
    """
    Remove all attachment links available into
    markdown content.
    For example:
    ![figure.png](https://cms-pdmv-dev.web.cern.ch/valdb/file/6425e123038a7fb98f2652ad)

    Parameters
    ------------
    content: str
        Markdown content to parse
    reference_placeholder: bool
        If True, instead of removing all the information about the image
        attachment, it will change the file name with a placeholder to invite
        the user to check the image via web page application
    """
    if reference_placeholder == False:
        # Remove all links
        parsed = markdown_parser.sub(repl="", string=content)
        return parsed

    # Use a placeholder instead
    message_regex = r"Image available in the report through the web application: \1"
    all_file_links = markdown_parser.sub(repl=message_regex, string=content)
    return all_file_links
