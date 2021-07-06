from bson.objectid import ObjectId
from core.database import MongoDatabase
from core.test import TestCase

collection_name = 'test_database_collection'

class TestDatabase(TestCase):

    def __init__(self, *args, **kwargs):
        db = MongoDatabase()
        db.database.drop_collection(collection_name)
        self.database_client = db.database
        self.database = MongoDatabase()
        super().__init__(*args, **kwargs)

    def test_database_is_singleton(self):
        instance1 = MongoDatabase()
        instance2 = MongoDatabase()
        self.assertTrue(instance1 is instance2)
        self.assertTrue(instance1.database is instance2.database)

    def test_create(self):
        data = {
            'string_field': 'string_create',
            'number_field': 1,
            'boolean_field': True,
            'array_field': [1, 2, 3],
        }

        created_id = self.database.create(collection_name, data)
        self.assertTrue(isinstance(created_id, ObjectId))
        db_data = self.database_client[collection_name].find_one(data)
        self.assertIsNotNone(db_data)
        self.assertEqual(created_id, db_data['_id'])
        self.assertEqual(data['string_field'], db_data['string_field'])
        self.assertEqual(data['number_field'], db_data['number_field'])
        self.assertEqual(data['boolean_field'], db_data['boolean_field'])
        self.assertEqual(data['array_field'], db_data['array_field'])

    def test_query(self):
        data = {
            'string_field': 'string1',
            'number_field': 1,
            'boolean_field': True,
            'array_field': [1, 2, 3],
        }

        data2 = {
            'string_field': 'string2',
            'number_field': 2,
            'boolean_field': False,
            'array_field': [1, 2, 5],
        }

        data3 = {
            'string_field': 'string3',
            'number_field': 3,
            'boolean_field': False,
            'array_field': [1, 2, 5],
        }

        created_id = self.database.create(collection_name, data)
        created_id2 = self.database.create(collection_name, data2)
        created_id3 = self.database.create(collection_name, data3)
        self.assertTrue(isinstance(created_id, ObjectId))
        self.assertTrue(isinstance(created_id2, ObjectId))
        self.assertTrue(isinstance(created_id3, ObjectId))

        query_string = {
            'number_field': {
                '$gte': 2,
            },
            'boolean_field': False,
        }
        query_result = self.database.query(collection_name, query_string, None)
        db_query_result = self.database_client[collection_name].find(query_string)
        
        list_db_query_result = list(db_query_result)
        self.assertEqual(len(query_result), 2)
        self.assertEqual(len(list_db_query_result), 2)
        self.assertListEqual(query_result, list_db_query_result)
        self.assertDictEqual(query_result[0], list_db_query_result[0])
        self.assertDictEqual(query_result[1], list_db_query_result[1])

    def test_update(self):
        data = {
            'string_field': 'string_update',
            'number_field': 1,
            'boolean_field': True,
            'array_field': [1, 2, 3],
        }

        created_id = self.database.create(collection_name, data)
        self.assertTrue(isinstance(created_id, ObjectId))
        db_data = self.database_client[collection_name].find_one(data)
        self.assertIsNotNone(db_data)
        self.assertEqual(created_id, db_data['_id'])
        
        data['string_field'] = 'altered_string'

        self.database.update(collection_name, created_id, data)
        db_updated_data = self.database_client[collection_name].find_one(data)
        self.assertEqual(db_updated_data['_id'], created_id)
        self.assertEqual(data['string_field'], 'altered_string')
        self.assertEqual(data['number_field'], db_updated_data['number_field'])
        self.assertEqual(data['boolean_field'], db_updated_data['boolean_field'])
        self.assertEqual(data['array_field'], db_updated_data['array_field'])

    def test_delete(self):
        data = {
            'string_field': 'string_delete',
        }

        created_id = self.database.create(collection_name, data)
        self.assertTrue(isinstance(created_id, ObjectId))
        db_data = self.database_client[collection_name].find_one(data)
        self.assertIsNotNone(db_data)
        self.assertEqual(created_id, db_data['_id'])
        
        self.database.delete(collection_name, created_id)

        db_query_result = self.database_client[collection_name].find_one(data)
        self.assertIsNone(db_query_result)

    def test_get(self):
        data = {
            'string_field': 'string_delete',
            'number_field': 1,
        }

        created_id = self.database.create(collection_name, data)
        self.assertTrue(isinstance(created_id, ObjectId))
        db_data = self.database_client[collection_name].find_one(data)
        self.assertIsNotNone(db_data)
        self.assertEqual(created_id, db_data['_id'])
        
        fetched_data = self.database.get(collection_name, created_id)
        self.assertEqual(fetched_data['_id'], created_id)
        self.assertEqual(fetched_data['string_field'], data['string_field'])
        self.assertEqual(fetched_data['number_field'], data['number_field'])
