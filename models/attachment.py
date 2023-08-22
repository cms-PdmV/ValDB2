"""
Attachment model
"""
import os
from core import Model


class Attachment(Model):
    """
    Attachment model
    """

    name: str
    content: str
    type: str
    size: int
    report_id: str

    def dict(self):
        dict_data = super().dict()
        dict_data.pop("content")
        host_url = os.getenv("HOST_URL", "")
        dict_data["url"] = f'{host_url}file/{dict_data["id"]}'
        return dict_data
