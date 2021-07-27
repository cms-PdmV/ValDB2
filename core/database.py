'''
Database interface
'''
from typing import Union
import os

from bson.objectid import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv

class MongoDatabase():
    '''
    Interface to MongoDB database
    '''

    # ensure single instance of database
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super().__new__(cls)
        return cls.instance

    def __init__(self):
        load_dotenv()
        database_host = os.getenv('DATABASE_HOST')
        database_port = int(os.getenv('DATABASE_PORT'))
        database_name = os.getenv('DATABASE_NAME')
        database_username = os.getenv('DATABASE_USERNAME')
        database_password = os.getenv('DATABASE_PASSWORD')
        client = MongoClient(
            database_host,
            database_port,
            username=database_username,
            password=database_password,
            authSource='admin',
            authMechanism='SCRAM-SHA-256')
        database = client[database_name]
        self.client = client
        self.database = database

    def create(self, collection_name: str, data: object) -> ObjectId:
        '''
        Create new reocrd
        '''
        return self.database[collection_name].insert_one(data).inserted_id

    def query(self, collection_name: str, query: dict, sort):
        '''
        Query record from database
        '''
        data = []
        if sort:
            for record in self.database[collection_name].find(query).sort(sort):
                data.append(record)
        else:
            for record in self.database[collection_name].find(query):
                data.append(record)
        return data

    def get(self, collection_name: str, record_id: Union[str, ObjectId]):
        '''
        Get one object from database
        '''
        if isinstance(record_id, str):
            record_id = ObjectId(record_id)
        return self.database[collection_name].find_one({'_id': record_id})

    def update(self, collection_name: str, record_id: ObjectId, data: object):
        '''
        Update record by id
        '''
        self.database[collection_name].find_one_and_update({'_id': record_id}, {'$set': data})

    def delete(self, collection_name: str, record_id: ObjectId):
        '''
        Delete record
        '''
        self.database[collection_name].find_one_and_delete({'_id': record_id})

    def count(self, collection_name: str, query: dict = None) -> int:
        '''
        Count number or record matched the query.
        '''
        query = {} if query is None else query
        return self.database[collection_name].count_documents(query)

database_connector = {
    'mongo': MongoDatabase
}

def get_database():
    '''
    Get database object. Return singleton database object.
    '''
    load_dotenv()
    database_connector_type = os.getenv('DATABASE_CONNECTOR')
    return (database_connector[database_connector_type])()
