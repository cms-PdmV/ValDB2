from unittest import TestCase

from bson.objectid import ObjectId
from core.model import Model
from core.database import MongoDatabase

collection_name_1 = 'test_collection_1'

class NewModel(Model):
    _name = collection_name_1
    name: str
    amount: int
    active: bool

class TestModel(TestCase):

    def __init__(self, *args, **kwargs):
        db = MongoDatabase()
        db.database.drop_collection(collection_name_1)
        super().__init__(*args, **kwargs)

    def test_save_get(self):
        db = MongoDatabase()
        data1 = NewModel()
        data1.name = 'test_name'
        data1.amount = 5
        data1.active = True
        data1.save()

        data2 = NewModel()
        data2.name = 'test_name2'
        data2.amount = 10
        data2.active = False
        data2.save()

        self.assertTrue(isinstance(data1._id, ObjectId))
        db_data1 = db.database[collection_name_1].find_one({'_id': data1._id})
        self.assertEqual(db_data1['name'], 'test_name')
        self.assertEqual(db_data1['amount'], 5)
        self.assertEqual(db_data1['active'], True)

        self.assertTrue(isinstance(data2._id, ObjectId))
        db_data2 = db.database[collection_name_1].find_one({'_id': data2._id})
        self.assertEqual(db_data2['name'], 'test_name2')
        self.assertEqual(db_data2['amount'], 10)
        self.assertEqual(db_data2['active'], False)

        data3 = NewModel({
            'name': 'test_name3',
            'amount': 20,
            'active': True,
        }).save()

        self.assertTrue(isinstance(data3._id, ObjectId))
        db_data3 = db.database[collection_name_1].find_one({'_id': data3._id})
        self.assertEqual(db_data3['name'], 'test_name3')
        self.assertEqual(db_data3['amount'], 20)
        self.assertEqual(db_data3['active'], True)

        data1.amount = 50
        data1.save()

        db_data1 = db.database[collection_name_1].find_one({'_id': data1._id})
        self.assertEqual(db_data1['amount'], 50)

    def test_get(self):
        data1 = NewModel()
        data1.name = 'test_name'
        data1.amount = 5
        data1.active = True
        data1.save()

        data2 = NewModel()
        data2.name = 'test_name2'
        data2.amount = 10
        data2.active = False
        data2.save()

        self.assertTrue(isinstance(data1._id, ObjectId))
        self.assertTrue(isinstance(data2._id, ObjectId))
        db_data1 = NewModel().get(data1._id)
        db_data2 = NewModel().get(data2._id)
        self.assertEqual(db_data1.name, 'test_name')
        self.assertEqual(db_data2.name, 'test_name2')
        self.assertEqual(db_data1.amount, 5)
        self.assertEqual(db_data2.amount, 10)
        self.assertEqual(db_data1.active, True)
        self.assertEqual(db_data2.active, False)

    def test_query(self):
        db = MongoDatabase()
        db.database.drop_collection(collection_name_1)

        self.assertEqual(len(NewModel().query({})), 0)

        data1 = NewModel()
        data1.name = 'test_name'
        data1.amount = 5
        data1.active = True
        data1.save()

        data2 = NewModel()
        data2.name = 'test_name2'
        data2.amount = 10
        data2.active = False
        data2.save()

        self.assertEqual(len(NewModel().query({})), 2)
        queried_data1 = NewModel().query({'name': 'test_name'})
        self.assertEqual(len(queried_data1), 1)
        self.assertEqual(queried_data1[0]._id, data1._id)


