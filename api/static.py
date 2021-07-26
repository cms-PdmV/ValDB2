'''
Static API
'''
import base64

from flask import make_response

from models.attachment import Attachment


def serve_file(fileid):
    '''
    Serve attachment
    '''
    attachment = Attachment.get(fileid)
    response = make_response(base64.decodebytes(attachment.content.encode('utf-8')))
    response.headers.set('Content-Type', attachment.type)
    response.headers.set(
        'Content-Disposition', 'inline', filename=attachment.name)
    return response
