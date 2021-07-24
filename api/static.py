'''
Static API
'''
import base64

from flask_restx import Resource
from flask import make_response

from models.attachment import Attachment
from core import Namespace

api = Namespace('groups', description='Show all available group in the system')

@api.route('/file/<string:fileid>')
@api.param('fileid', 'ObjectId of file')
class FileAPI(Resource):
    '''
    Show static file stored in database
    '''
    def get(self, fileid):
        '''
        Serve attachment
        '''
        attachment = Attachment.get(fileid)
        response = make_response(base64.decodebytes(attachment.content.encode('utf-8')))
        response.headers.set('Content-Type', attachment.type)
        response.headers.set(
            'Content-Disposition', 'inline', filename=attachment.name)
        return response
