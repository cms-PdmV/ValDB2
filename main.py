'''
Main module for valdb
'''
import os
import logging

from werkzeug.middleware.proxy_fix import ProxyFix
from flask import Flask, request, session, render_template
from jinja2.exceptions import TemplateNotFound
from flask_cors import CORS
from dotenv import load_dotenv

from api import api
from api.static import serve_file
from database.index import database_index_setup
from lookup.user_group import UserGroupLookup
from middlewares.auth import AuthenticationMiddleware

load_dotenv()
logging.basicConfig(level=logging.INFO)

# setup database indexes
database_index_setup()

# setup lookup table
lookup = UserGroupLookup()
lookup.update()

app = Flask(__name__,
    static_folder='./build/static',
    template_folder='./build')

# Set secret key for session cookie
app.secret_key = os.getenv('SECRET_KEY')

# Handle redirections from a reverse proxy
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

auth: AuthenticationMiddleware = AuthenticationMiddleware(
    app=app,
    client_id=os.getenv('CLIENT_ID'),
    client_secret=os.getenv('CLIENT_SECRET'),
    home_endpoint="catch_all"
)

api.init_app(app)
CORS(app, supports_credentials=True)

@app.before_request
def auth_handler():
    """
    Disable authentication for static files
    """
    if "static" in request.endpoint:
        return None
    else:
        return auth(request=request, session=session)

@app.route('/', defaults={'_path': ''}, strict_slashes=False)
@app.route('/<path:_path>')
def catch_all(_path):
    '''
    Return index.html for all paths except API
    '''
    try:
        return render_template('index.html')
    except TemplateNotFound:
        response = '<script>setTimeout(function() {location.reload();}, 5000);</script>'
        response += 'Webpage is starting, please wait a few minutes...'
        return response

@app.route('/valdb/file/<string:fileid>')
@app.route('/file/<string:fileid>')
def serve_file_attachment(fileid):
    '''
    Serve attachment from /file endpoint
    '''
    return serve_file(fileid)

if __name__ == '__main__':
    host = os.getenv('HOST')
    port = os.getenv('PORT')
    app.run(host=host, port=port ,debug=True)
