from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database.index import database_index_setup
from api import api
from flask_restx import cors

load_dotenv()

app = Flask(__name__)
api.init_app(app)
CORS(app, supports_credentials=True, methods=["GET", "OPTIONS", "POST", "PUT", "DELETE"])

# setup database indexes
database_index_setup()


# from core.database import get_database
# database = get_database()()
# database.client.drop_database('debug_valdb')


if __name__ == '__main__':
    app.run(debug=True)