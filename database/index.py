'''
Database setup file
'''

from pymongo import TEXT

from core.database import get_database

def database_index_setup():
    '''
    Setup index in database
    '''
    database = get_database()
    database.database['campaign'].create_index('name')
    database.database['user'].create_index('email')
    database.database['report'].create_index([('group' , TEXT), ('campaign_name', TEXT)])
