from flask_restx import Api

from .todo import api as todo_namespace
from .campaign import api as campaign_namespace
from .report import api as report_namespace
from .group import api as group_namespace

# TODO: change this to match system info
api = Api(
    title='My Title',
    version='1.0',
    description='A description',
)

api.add_namespace(todo_namespace, path='/api/todo')
api.add_namespace(campaign_namespace, path='/api/campaigns')
api.add_namespace(report_namespace, path='/api/reports')
api.add_namespace(group_namespace, path='/api/groups')