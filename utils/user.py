'''
user util
'''
from werkzeug.exceptions import Forbidden
from models.user import User
from core_lib.middlewares.auth import UserInfo as MiddlewareUserInfo

def require_permission(session, roles, from_sso: bool = False):
    '''
    Check if requested user have right permission. For some operations,
    decide if the user is allowed checking only its e-groups.
    Raise Forbidden if do not have premission
    '''
    if from_sso:
        user_data: MiddlewareUserInfo = session.get("user")
        required_group = set(roles)
        user_egroups = set(user_data.roles)
        if required_group - user_egroups:
            raise Forbidden()

    else:
        User.get_from_session(session).requires(roles)
