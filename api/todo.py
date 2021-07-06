from models.todo import Todo
from flask_restx import Resource
from core import Namespace

api = Namespace('todo', description='todo list from the system')

todo_model = api.model(Todo)

@api.route('/')
class TodoListAPI(Resource):
    @api.marshal_list_with(todo_model)
    def get(self):
        todos = Todo.query({})
        return [todo.dict() for todo in todos]

    @api.marshal_with(todo_model)
    def post(self):
        new_todo = Todo(api.payload).save()
        return new_todo.dict()


@api.route('/<string:id>')
@api.param('id', 'Task ID')
class TodoAPI(Resource):
    @api.marshal_with(todo_model)
    def get(self, id):
        return Todo.get(id).dict()

    @api.marshal_with(todo_model)
    def put(self, id):
        return Todo.get(id).update(api.payload).dict()

    def delete(self, id):
        return Todo.get(id).unlink()
