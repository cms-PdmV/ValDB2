'''
Main module for valdb
'''
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from api import api

from database.index import database_index_setup
from lookup.user_group import UserGroupLookup

load_dotenv()

# setup database indexes
database_index_setup()

# setup lookup table
lookup = UserGroupLookup()
lookup.update()

app = Flask(__name__)
api.init_app(app)
CORS(app, supports_credentials=True, methods=["GET", "OPTIONS", "POST", "PUT", "DELETE"])

if __name__ == '__main__':
    app.run(debug=True)
