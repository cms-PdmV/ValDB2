'''
user util
'''
from models.user import User

def require_permission(request, roles):
    '''
    Check if requested user have right permission
    Raise Forbidden if do not have premission
    '''
    User.get_from_request(request).requires(roles)
