from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from api import api

load_dotenv()

app = Flask(__name__)
CORS(app)
api.init_app(app)

if __name__ == '__main__':
    app.run(debug=True)