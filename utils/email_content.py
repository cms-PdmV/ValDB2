"""
Some auxiliary functions
to parse markdown content before
transform it into HTML
"""
import os
import re

CMS_TALK = "cmstalk+relval@dovecotmta.cern.ch"
CMS_TALK_TEST = "cmstalk+test@dovecotmta.cern.ch"
CMS_TALK_TRIGGER = "cmstalk+trigger-performance@dovecotmta.cern.ch"
CMS_TALK_RECO_MUON = "cmstalk+muon-object-validation@dovecotmta.cern.ch"

MARKDOWN_ATTACHMENT = r"!\[(.*?)\]\((.*?)\)"
markdown_parser = re.compile(MARKDOWN_ATTACHMENT)
keep_image_filenames = True if not os.getenv("DISCARD_LINKS") else False


class EmailAddress:
    """
    Common email address
    """

    enable_to_production = os.getenv("PRODUCTION")
    custom_forum_address = os.getenv("CUSTOM_FORUM_ADDRESS")
    custom_trigger_forum = os.getenv("CUSTOM_TRIGGER_FORUM_ADDRESS", "")
    custom_reco_muon_forum = os.getenv("CUSTOM_RECO_MUON_FORUM_ADDRESS", "")

    if enable_to_production:
        forum = CMS_TALK
        forum_trigger = CMS_TALK_TRIGGER
        forum_reco_muon = CMS_TALK_RECO_MUON
    elif custom_forum_address:
        forum = custom_forum_address
        # Only for testing purposes, link the extra channel addresses
        # to the development team's email addresses
        forum_trigger = custom_trigger_forum
        forum_reco_muon = custom_reco_muon_forum
    else:
        forum = CMS_TALK_TEST
        forum_trigger = ""
        forum_reco_muon = ""


def parse_attachment_links(content: str, reference_placeholder=keep_image_filenames):
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
