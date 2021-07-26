'''
Main module for valdb
'''
from flask import Flask, render_template
from jinja2.exceptions import TemplateNotFound
from flask_cors import CORS
from dotenv import load_dotenv

from api import api
from api.static import serve_file
from database.index import database_index_setup
from lookup.user_group import UserGroupLookup

load_dotenv()

# setup database indexes
database_index_setup()

# setup lookup table
lookup = UserGroupLookup()
lookup.update()

app = Flask(__name__,
    static_folder='./build/static',
    template_folder='./build')

api.init_app(app)
CORS(app, supports_credentials=True)

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

@app.route('/file/<string:fileid>')
def serve_file_attachment(fileid):
    '''
    Serve attachment from /file endpoint
    '''
    return serve_file(fileid)

if __name__ == '__main__':
    app.run(debug=True)
