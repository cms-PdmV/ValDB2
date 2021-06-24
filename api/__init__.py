from flask_restx import Api

from .todo import api as todo_namespace

api = Api(
    title='My Title',
    version='1.0',
    description='A description',
)

api.add_namespace(todo_namespace, path='/todo')