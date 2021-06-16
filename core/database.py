from typing import Union
from bson.objectid import ObjectId
from pymongo import MongoClient

class MongoDatabase():
    # ensure single instance of database
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super().__new__(cls)
        return cls.instance

    def __init__(self):
        # TODO: read connection string from env
        client = MongoClient('localhost', 27017)
        database = client['testdb']
        self.client = client
        self.database = database

    def create(self, collection_name: str, data: object) -> ObjectId:
        return self.database[collection_name].insert_one(data).inserted_id

    def query(self, collection_name: str, query: dict):
        data = []
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
