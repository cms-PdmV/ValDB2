from flask_restx import Resource

class TodoController(Resource):
    def get(self):
        return {'status': 'ok'}