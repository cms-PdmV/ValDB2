'''
Attachment model
'''
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
        return dict_data
        