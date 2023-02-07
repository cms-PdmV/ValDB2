'''
user util
'''
from werkzeug.exceptions import Forbidden
from models.user import User

def require_permission(request, roles, from_sso: bool = False):
    '''
    Check if requested user have right permission. For some operations,
    decide if the user is allowed checking only its e-groups.
    Raise Forbidden if do not have premission
    '''
    if from_sso:
        required_group = set(roles)
        user_egroups = set(request.environ.get('user').get('groups'))
        if required_group - user_egroups:
            raise Forbidden()

    else:
        User.get_from_request(request).requires(roles)
