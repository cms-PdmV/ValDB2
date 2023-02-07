"""
Autorization middleware
"""
import jwt
from werkzeug.wrappers import Request, Response

ADFS_EMAIL_HEADER_KEY = "Adfs-Email"
ADFS_USERNAME_HEADER_KEY = "Adfs-Login"
ADFS_FULLNAME_KEY = "Adfs-Fullname"
ADFS_EGROUPS_KEY = "Adfs-Group"
KEYCLOAK_TOKEN_HEADER_KEY = "X-Forwarded-Access-Token"


class AuthorizationMiddleware:
    """
    CERN SSO authentication middleware
    """

    def __init__(self, app):
        self.app = app

    @classmethod
    def __parse_jwt(cls, token):
        """
        Parse a JWT token given by string and return its payload
        as a dictionary
        """
        return jwt.decode(token, options={"verify_signature": False})

    @classmethod
    def __get_user_info_keycloak_sso(cls, request):
        token = request.headers.get("X-Forwarded-Access-Token", "")
        decoded_token = AuthorizationMiddleware.__parse_jwt(token=token)

        username = decoded_token.get("cern_upn")
        fullname = decoded_token.get("name")
        email = decoded_token.get("email")
        groups = decoded_token.get("cern_roles", [])
        
        if email and username:
            return {
                "email": email.lower(),
                "username": username,
                "fullname": fullname,
                "groups": groups,
            }
        return None

    @classmethod
    def __get_user_info_adfs_sso(cls, request):
        email = request.headers.get(ADFS_EMAIL_HEADER_KEY)
        username = request.headers.get(ADFS_USERNAME_HEADER_KEY)
        fullname = request.headers.get(ADFS_FULLNAME_KEY)
        groups = request.headers.get(ADFS_EGROUPS_KEY, "").split(";")
        groups = [x.strip().lower() for x in groups if x.strip()]

        if email and username:
            return {
                "email": email.lower(),
                "username": username,
                "fullname": fullname,
                "groups": groups,
            }
        return None


    def __call__(self, environ, start_response):
        request = Request(environ)
        token = request.headers.get("X-Forwarded-Access-Token", None)
        if token:
            userinfo = AuthorizationMiddleware.__get_user_info_keycloak_sso(
                request=request
            )
        else:
            userinfo = AuthorizationMiddleware.__get_user_info_adfs_sso(
                request=request
            )

        if userinfo:
            environ["user"] = userinfo
            return self.app(environ, start_response)

        res = Response("Authorization failed", mimetype="text/plain", status=401)
        return res(environ, start_response)
