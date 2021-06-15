from flask import Flask
from flask_restx import Api
from routes import add_routes

app = Flask(__name__)
api = Api(app, version='1.0', title='Sample API',
    description='A sample API',
)

add_routes(api)

if __name__ == '__main__':
    app.run(debug=True)