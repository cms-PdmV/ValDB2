from flask_restx import Api

from .todo import api as todo_namespace
from models import api as model_config

api = Api(
    title='My Title',
    version='1.0',
    description='A description',
)

api.add_namespace(model_config)
api.add_namespace(todo_namespace, path='/todo')