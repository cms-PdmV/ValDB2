'''
Attachment API
'''
import base64

from flask.globals import request
from flask_restx import Resource

from models.attachment import Attachment
from core import Namespace

api = Namespace('groups', description='Create/get metadata of system attacchment')

@api.route('/')
class AttachmentCreateAPI(Resource):
    '''
    Attachment create API
    '''
    def post(self):
        '''
        Create/upload new attachment
        '''
        file = request.files.get('file')
        file_base64 = base64.b64encode(file.read())
        file_content = file_base64.decode('utf-8')
        return Attachment({
            'name': request.form.get('name'),
            'size': int(request.form.get('size')),
            'type': request.form.get('type'),
            'content': file_content,
        }).save().dict()

@api.route('/<string:attachmentid>')
@api.param('attachmentid', 'Attachment ID')
class AttachmentAPI(Resource):
    '''
    Attachment API
    '''
    def get(self, attachmentid):
        '''
        Get attachment metadata
        '''
        return Attachment.get(attachmentid).dict()
