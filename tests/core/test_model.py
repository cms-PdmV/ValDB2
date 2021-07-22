from datetime import datetime
from enum import Enum

from bson.objectid import ObjectId
from flask_restx import fields

from core.model import CustomField, Model
from core.database import MongoDatabase
from core.test import TestCase

NEW_MODEL_COLLECTION_NAME = 'new_model'

class NewModel(Model):
    name: str
    amount: int
    active: bool
    numbers: list[int]

class Status(Enum):
    TODO = 1
    DONE = 2

class Child(Model):
    name: str

class AllTypeModel(Model):
    name: str
    number: int
    value: float
    active: bool
    time_at: datetime
    status: Status
    child: Child
    childs: list[Child]
    numbers: list[int]

class TestModel(TestCase):

    def __init__(self, *args, **kwargs):
        database = MongoDatabase()
        database.database.drop_collection(NEW_MODEL_COLLECTION_NAME)
        super().__init__(*args, **kwargs)

    def test_save_get(self):
        database = MongoDatabase()
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

        self.assertTrue(isinstance(data1.id, ObjectId))
        database_data1 = database.database[NEW_MODEL_COLLECTION_NAME].find_one({'_id': data1.id})
        self.assertEqual(database_data1['name'], 'test_name')
        self.assertEqual(database_data1['amount'], 5)
        self.assertEqual(database_data1['active'], True)

        self.assertTrue(isinstance(data2.id, ObjectId))
        database_data2 = database.database[NEW_MODEL_COLLECTION_NAME].find_one({'_id': data2.id})
        self.assertEqual(database_data2['name'], 'test_name2')
        self.assertEqual(database_data2['amount'], 10)
        self.assertEqual(database_data2['active'], False)

        data3 = NewModel({
            'name': 'test_name3',
            'amount': 20,
            'active': True,
        }).save()

        self.assertTrue(isinstance(data3.id, ObjectId))
        database_data3 = database.database[NEW_MODEL_COLLECTION_NAME].find_one({'_id': data3.id})
        self.assertEqual(database_data3['name'], 'test_name3')
        self.assertEqual(database_data3['amount'], 20)
        self.assertEqual(database_data3['active'], True)

        data1.amount = 50
        data1.save()

        database_data1 = database.database[NEW_MODEL_COLLECTION_NAME].find_one({'_id': data1.id})
        self.assertEqual(database_data1['amount'], 50)

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

        self.assertTrue(isinstance(data1.id, ObjectId))
        self.assertTrue(isinstance(data2.id, ObjectId))
        database_data1 = NewModel.get(data1.id)
        database_data2 = NewModel.get(data2.id)
        self.assertEqual(database_data1.name, 'test_name')
        self.assertEqual(database_data2.name, 'test_name2')
        self.assertEqual(database_data1.amount, 5)
        self.assertEqual(database_data2.amount, 10)
        self.assertEqual(database_data1.active, True)
        self.assertEqual(database_data2.active, False)

    def test_query(self):
        database = MongoDatabase()
        database.database.drop_collection(NEW_MODEL_COLLECTION_NAME)

        self.assertEqual(len(NewModel.query({})), 0)

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

        self.assertEqual(len(NewModel.query({})), 2)
        queried_data1 = NewModel.query({'name': 'test_name'})
        self.assertEqual(len(queried_data1), 1)
        self.assertEqual(queried_data1[0].id, data1.id)

    def test_unlink(self):
        database = MongoDatabase()

        data1 = NewModel()
        data1.name = 'test_name_to_be_deleted'
        data1.amount = 5
        data1.active = True
        data1.save()

        data1_id = data1.id
        database_data1 = database.database[NEW_MODEL_COLLECTION_NAME].find_one({'_id': data1_id})
        self.assertEqual(database_data1['_id'],  data1.id)

        data1.unlink()
        database_data1 = database.database[NEW_MODEL_COLLECTION_NAME].find_one({'_id': data1_id})
        self.assertEqual(database_data1,  None)
        self.assertEqual(data1.id,  None)
        self.assertEqual(data1.name,  'test_name_to_be_deleted')

        data1.save()
        self.assertTrue(isinstance(data1.id, ObjectId))
        self.assertNotEqual(data1.id, data1_id)
        database_data1 = database.database[NEW_MODEL_COLLECTION_NAME].find_one({'_id': data1.id})
        self.assertEqual(database_data1['_id'],  data1.id)
        self.assertEqual(database_data1['name'],  'test_name_to_be_deleted')

    def test_model_reference_save(self):
        parent_collection_name = 'new_parent_model'
        class NewParentModel(Model):
            name: str
            childs: list[NewModel]

        database = MongoDatabase()

        child1 = NewModel({'name': 'c1'}).save()
        child2 = NewModel({'name': 'c2'}).save()
        child3 = NewModel({'name': 'c3'}).save()

        parent = NewParentModel({
            'name': 'test_parent_1',
            'childs': [child1, child2, child3],
        }).save()

        database_parent = database.database[parent_collection_name].find_one({'_id': parent.id})
        self.assertTrue(isinstance(parent.id, ObjectId))
        self.assertTrue(len(database_parent['childs']), 3)
        self.assertTrue(database_parent['childs'][0], child1.id)
        self.assertTrue(database_parent['childs'][1], child2.id)
        self.assertTrue(database_parent['childs'][2], child3.id)

        # test unsaved child, should save when parent is saved
        child4 = NewModel({'name': 'c4'})
        parent.childs.append(child4)

        parent.save()
        database_parent = database.database[parent_collection_name].find_one({'_id': parent.id})
        self.assertTrue(len(database_parent['childs']), 4)
        self.assertTrue(database_parent['childs'][3], child4.id)

    def test_model_non_reference_save(self):
        parent_collection_name = 'new_parent_model'
        class NewParentModel(Model):
            name: str
            childs: list[str]

        parent = NewParentModel({
            'name': 'test_parent_non_reference',
            'childs': ['a', 'b', 'c'],
        })

        parent.save()

        database = MongoDatabase()
        database_parent = database.database[parent_collection_name].find_one({'_id': parent.id})
        self.assertEqual(database_parent['childs'], ['a', 'b', 'c'])

    def test_model_reference_get(self):
        class NewParentModel(Model):
            name: str
            childs: list[NewModel]

        child1 = NewModel({'name': 'c1'}).save()
        child2 = NewModel({'name': 'c2'}).save()
        child3 = NewModel({'name': 'c3'}).save()

        parent = NewParentModel({
            'name': 'test_parent_1',
            'childs': [child1, child2, child3],
        }).save()

        fetched_parent = NewParentModel.get(parent.id)
        self.assertEqual(len(fetched_parent.childs), 3)
        self.assertEqual(fetched_parent.childs[0].id, child1.id)
        self.assertEqual(fetched_parent.childs[1].id, child2.id)
        self.assertEqual(fetched_parent.childs[2].id, child3.id)

        self.assertTrue(isinstance(fetched_parent.childs[0], NewModel))
        self.assertTrue(isinstance(fetched_parent.childs[1], NewModel))
        self.assertTrue(isinstance(fetched_parent.childs[2], NewModel))

    def test_get_collection_name(self):
        self.assertEqual(NewModel.get_collection_name(), NEW_MODEL_COLLECTION_NAME)

    def test_type_enum(self):
        class StatusEnum(Enum):
            TODO = 1
            IN_PROGRESS = 2
            DONE = 3

        class Todo(Model):
            name: str
            status: StatusEnum

        database = MongoDatabase()

        todo1 = Todo()
        todo1.name = 'todo_1'
        todo1.status = StatusEnum.TODO
        todo1.save()

        fetched_todo1 = Todo.get(todo1.id)
        database_todo1 = database.database['todo'].find_one({'_id': todo1.id})
        self.assertTrue(isinstance(fetched_todo1.status, StatusEnum))
        self.assertEqual(fetched_todo1.status, StatusEnum.TODO)
        self.assertEqual(database_todo1['status'], 1)

        todo1.status = StatusEnum.DONE
        todo1.save()

        fetched_todo1 = Todo.get(todo1.id)
        database_todo1 = database.database['todo'].find_one({'_id': todo1.id})
        self.assertTrue(isinstance(fetched_todo1.status, StatusEnum))
        self.assertEqual(fetched_todo1.status, StatusEnum.DONE)
        self.assertEqual(database_todo1['status'], 3)

    def test_type_many2one_reference(self):
        class Category(Model):
            name: str

        class Restaurant(Model):
            name: str
            category: Category

        thai_food_category = Category({'name': 'thai'}).save()
        restaurant = Restaurant()
        restaurant.name = 'restaurant1'
        restaurant.category = thai_food_category
        restaurant.save()

        fetched_restaurant = Restaurant.get(restaurant.id)
        self.assertTrue(isinstance(fetched_restaurant.category, Category))
        self.assertEqual(fetched_restaurant.category.id, thai_food_category.id)
        self.assertEqual(fetched_restaurant.category.name, 'thai')

    def test_type_datetime(self):
        class DateTimeModel(Model):
            field: datetime

        current_time = datetime.utcnow()

        data = DateTimeModel({'field': current_time}).save()
        self.assertTrue(isinstance(data.field, datetime))
        fetched_data = DateTimeModel.get(data.id)
        self.assertTrue(isinstance(fetched_data.field, datetime))

    def test_partial_set_object(self):
        new_model1 = NewModel({
            'name': 'new name'
        }).save()

        self.assertTrue(hasattr(new_model1, 'name'))
        self.assertTrue(hasattr(new_model1, 'amount'))
        self.assertTrue(hasattr(new_model1, 'active'))
        self.assertTrue(hasattr(new_model1, 'numbers'))
        self.assertIsNotNone(new_model1.name)
        self.assertIsNone(new_model1.amount)
        self.assertIsNone(new_model1.active)
        self.assertIsNone(new_model1.numbers)

    def test_update(self):
        new_model1 = NewModel()

        self.assertIsNone(new_model1.name)
        self.assertIsNone(new_model1.active)

        new_model1.name = 'name'
        new_model1.save()
        new_model1_id = new_model1.id

        self.assertIsNotNone(new_model1.name)
        self.assertIsNone(new_model1.active)

        fetched_new_model1 = NewModel.get(new_model1_id)
        self.assertEqual(fetched_new_model1.name, 'name')
        self.assertIsNone(fetched_new_model1.active)

        new_model1.update({
            'name': 'altered_name',
            'active': True,
        })

        self.assertIsNotNone(new_model1.name)
        self.assertIsNotNone(new_model1.active)
        self.assertEqual(new_model1.id, new_model1_id)

        fetched_new_model1 = NewModel.get(new_model1_id)
        self.assertEqual(fetched_new_model1.name, 'altered_name')
        self.assertEqual(fetched_new_model1.active, True)

    def test_created_updated_field(self):
        data = NewModel().save()

        self.assertTrue(isinstance(data.created_at, datetime))
        self.assertTrue(isinstance(data.updated_at, datetime))

        data_created_at = data.created_at
        data2 = data.save()

        self.assertTrue(isinstance(data2.created_at, datetime))
        self.assertTrue(isinstance(data2.updated_at, datetime))
        self.assertTrue(data2.updated_at > data_created_at)
        self.assertTrue(data2.created_at == data.created_at)

    def test_dict_serialize(self):
        child1 = Child({'name': 'child1'}).save()
        child2 = Child({'name': 'child2'}).save()
        child3 = Child({'name': 'child3'}).save()

        data = AllTypeModel()
        data.name = 'test'
        data.number = 1
        data.value = 3.14
        data.active = True
        data.time_at = datetime.utcnow()
        data.status = Status.TODO
        data.child = child1
        data.childs = [child1, child2, child3]
        data.numbers = [1, 2, 3]

        data.save()
        serialized_data = data.dict()

        self.assertTrue(isinstance(serialized_data['id'], str))
        self.assertTrue(isinstance(serialized_data['created_at'], str))
        self.assertTrue(isinstance(serialized_data['updated_at'], str))
        self.assertTrue(isinstance(serialized_data['number'], int))
        self.assertTrue(isinstance(serialized_data['value'], float))
        self.assertTrue(isinstance(serialized_data['active'], bool))
        self.assertTrue(isinstance(serialized_data['time_at'], str))
        self.assertTrue(isinstance(serialized_data['status'], int))
        self.assertTrue(isinstance(serialized_data['child'], dict))
        self.assertTrue(isinstance(serialized_data['childs'], list))
        self.assertTrue(isinstance(serialized_data['childs'][0], dict))
        self.assertTrue(isinstance(serialized_data['childs'][0]['id'], str))
        self.assertTrue(isinstance(serialized_data['childs'][0]['name'], str))
        self.assertTrue(isinstance(serialized_data['childs'][1], dict))
        self.assertTrue(isinstance(serialized_data['childs'][1]['id'], str))
        self.assertTrue(isinstance(serialized_data['childs'][1]['name'], str))
        self.assertTrue(isinstance(serialized_data['childs'][2], dict))
        self.assertTrue(isinstance(serialized_data['childs'][2]['id'], str))
        self.assertTrue(isinstance(serialized_data['childs'][2]['name'], str))
        self.assertTrue(isinstance(serialized_data['numbers'], list))
        self.assertTrue(isinstance(serialized_data['numbers'][0], int))
        self.assertTrue(isinstance(serialized_data['numbers'][1], int))
        self.assertTrue(isinstance(serialized_data['numbers'][2], int))

    def test_get_restx_fields(self):
        restx_fields = AllTypeModel.get_flask_restx_fields()
        self.assertTrue(restx_fields['id'] is fields.String)
        self.assertTrue(restx_fields['created_at'] is fields.String)
        self.assertTrue(restx_fields['updated_at'] is fields.String)
        self.assertTrue(restx_fields['number'] is fields.Integer)
        self.assertTrue(restx_fields['value'] is fields.Float)
        self.assertTrue(restx_fields['active'] is fields.Boolean)
        self.assertTrue(restx_fields['time_at'] is fields.String)
        self.assertTrue(restx_fields['status'], fields.Integer)
        self.assertTrue(isinstance(restx_fields['child'], CustomField))
        self.assertTrue(isinstance(restx_fields['childs'], fields.List))
        self.assertTrue(isinstance(restx_fields['numbers'], fields.List))
