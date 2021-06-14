from flask import Flask
from flask_restx import Api
from routes import add_routes
from database.memory import MemoryDatabase

app = Flask(__name__)
api = Api(app, version='1.0', title='Sample API',
    description='A sample API',
)
database = MemoryDatabase

add_routes(api)

if __name__ == '__main__':
    app.run(debug=True)