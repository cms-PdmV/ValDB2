'''
Attachment model
'''
import os

from core import Model

class Attachment(Model):
    '''
    Attachment model
    '''
    name: str
    content: str
    type: str
    size: int

    def dict(self):
        dict_data = super().dict()
        dict_data.pop('content')
        dict_data['url'] = f'{os.getenv("HOST_URL")}/file/{dict_data["id"]}'
        return dict_data
