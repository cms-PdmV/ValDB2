from controllers import todo_controller

def add_routes(api):
    api.add_resource(todo_controller.TodoController, '/todo')