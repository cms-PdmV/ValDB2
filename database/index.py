'''
Database setup file
'''

from core.database import get_database

def database_index_setup():
    '''
    Setup index in database
    '''
    database = get_database()
    database.database['campaign'].create_index('name')
