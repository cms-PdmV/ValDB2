'''
API endpoints of the system.
Need to add new namespace here and register with path endpoint.
'''

from flask_restx import Api

from .campaign import api as campaign_namespace
from .report import api as report_namespace
from .group import api as group_namespace
from .user import api as user_namespace
from .activity import api as activity_namespace
from .user_group import api as user_group_namespace
from .attachment import api as attachment_namespace

api = Api(
    title='ValDB API',
    version='0.1',
    description='API for ValDB system.',
    doc='/api/doc',
    prefix='/api',
)

api.add_namespace(campaign_namespace, path='/campaigns')
api.add_namespace(report_namespace, path='/reports')
api.add_namespace(group_namespace, path='/groups')
api.add_namespace(user_namespace, path='/users')
api.add_namespace(activity_namespace, path='/activities')
api.add_namespace(user_group_namespace, path='/usergroups')
api.add_namespace(attachment_namespace, path='/attachment')
