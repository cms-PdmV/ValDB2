from typing import Union
import os

from bson.objectid import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv

class MongoDatabase():
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
        client = MongoClient(database_host, database_port)
        database = client[database_name]
        self.client = client
        self.database = database

    def create(self, collection_name: str, data: object) -> ObjectId:
        return self.database[collection_name].insert_one(data).inserted_id

    def query(self, collection_name: str, query: dict, sort):
        data = []
        print(sort)
        if sort:
            for record in self.database[collection_name].find(query).sort(sort):
                data.append(record)
        else:
            for record in self.database[collection_name].find(query):
                data.append(record)
        return data
    
    def get(self, collection_name: str, id: Union[str, ObjectId]):
        if isinstance(id, str):
            id = ObjectId(id)
        return self.database[collection_name].find_one({'_id': id})

    def update(self, collection_name: str, id: ObjectId, data: object):
        self.database[collection_name].find_one_and_update({'_id': id}, {'$set': data})

    def delete(self, collection_name: str, id: ObjectId):
        self.database[collection_name].find_one_and_delete({'_id': id})

    def count(self, collection_name: str, filter: dict = {}) -> int:
        return self.database[collection_name].count_documents(filter)

database_connector = {
    'mongo': MongoDatabase
}

def get_database():
    load_dotenv()
    database_connector_type = os.getenv('DATABASE_CONNECTOR')
    return database_connector[database_connector_type]