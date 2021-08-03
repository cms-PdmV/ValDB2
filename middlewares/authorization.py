'''
Autorization middleware
'''
from werkzeug.wrappers import Request, Response

ADFS_EMAIL_HEADER_KEY = 'Adfs-Email'
ADFS_USERNAME_HEADER_KEY = 'Adfs-Login'
ADFS_FULLNAME_KEY = 'Adfs-Fullname'

class AuthorizationMiddleware:
    '''
    CERN Adfs SSO authentication middleware
    '''

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        request = Request(environ)
        email = request.headers.get(ADFS_EMAIL_HEADER_KEY)
        username = request.headers.get(ADFS_USERNAME_HEADER_KEY)
        fullname = request.headers.get(ADFS_FULLNAME_KEY)

        if email and username:
            environ['user'] = {
                'email': email,
                'username': username,
                'fullname': fullname,
            }
            return self.app(environ, start_response)

        res = Response(u'Authorization failed', mimetype= 'text/plain', status=401)
        return res(environ, start_response)
