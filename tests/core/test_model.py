from bson.objectid import ObjectId
from core.model import Model
from core.database import MongoDatabase
from core.test import TestCase
from enum import Enum

new_model_collection_name = 'new_model'

class NewModel(Model):
    name: str
    amount: int
    active: bool
    numbers: list[int]

class TestModel(TestCase):

    def __init__(self, *args, **kwargs):
        db = MongoDatabase()
        db.database.drop_collection(new_model_collection_name)
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
        db_data1 = db.database[new_model_collection_name].find_one({'_id': data1._id})
        self.assertEqual(db_data1['name'], 'test_name')
        self.assertEqual(db_data1['amount'], 5)
        self.assertEqual(db_data1['active'], True)

        self.assertTrue(isinstance(data2._id, ObjectId))
        db_data2 = db.database[new_model_collection_name].find_one({'_id': data2._id})
        self.assertEqual(db_data2['name'], 'test_name2')
        self.assertEqual(db_data2['amount'], 10)
        self.assertEqual(db_data2['active'], False)

        data3 = NewModel({
            'name': 'test_name3',
            'amount': 20,
            'active': True,
        }).save()

        self.assertTrue(isinstance(data3._id, ObjectId))
        db_data3 = db.database[new_model_collection_name].find_one({'_id': data3._id})
        self.assertEqual(db_data3['name'], 'test_name3')
        self.assertEqual(db_data3['amount'], 20)
        self.assertEqual(db_data3['active'], True)

        data1.amount = 50
        data1.save()

        db_data1 = db.database[new_model_collection_name].find_one({'_id': data1._id})
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
        db_data1 = NewModel.get(data1._id)
        db_data2 = NewModel.get(data2._id)
        self.assertEqual(db_data1.name, 'test_name')
        self.assertEqual(db_data2.name, 'test_name2')
        self.assertEqual(db_data1.amount, 5)
        self.assertEqual(db_data2.amount, 10)
        self.assertEqual(db_data1.active, True)
        self.assertEqual(db_data2.active, False)

    def test_query(self):
        db = MongoDatabase()
        db.database.drop_collection(new_model_collection_name)

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
        self.assertEqual(queried_data1[0]._id, data1._id)

    def test_unlink(self):
        db = MongoDatabase()

        data1 = NewModel()
        data1.name = 'test_name_to_be_deleted'
        data1.amount = 5
        data1.active = True
        data1.save()

        data1_id = data1._id
        db_data1 = db.database[new_model_collection_name].find_one({'_id': data1_id})
        self.assertEqual(db_data1['_id'],  data1._id)

        data1.unlink()
        db_data1 = db.database[new_model_collection_name].find_one({'_id': data1_id})
        self.assertEqual(db_data1,  None)
        self.assertEqual(data1._id,  None)
        self.assertEqual(data1.name,  'test_name_to_be_deleted')

        data1.save()
        self.assertTrue(isinstance(data1._id, ObjectId))
        self.assertNotEqual(data1._id, data1_id)
        db_data1 = db.database[new_model_collection_name].find_one({'_id': data1._id})
        self.assertEqual(db_data1['_id'],  data1._id)
        self.assertEqual(db_data1['name'],  'test_name_to_be_deleted')

    def test_model_reference_save(self):
        new_parent_collection_name = 'new_parent_model'
        class NewParentModel(Model):
            name: str
            childs: list[NewModel]

        db = MongoDatabase()

        child1 = NewModel({'name': 'c1'}).save()
        child2 = NewModel({'name': 'c2'}).save()
        child3 = NewModel({'name': 'c3'}).save()

        parent = NewParentModel({
            'name': 'test_parent_1',
            'childs': [child1, child2, child3],
        }).save()

        db_parent = db.database[new_parent_collection_name].find_one({'_id': parent._id})
        self.assertTrue(isinstance(parent._id, ObjectId))
        self.assertTrue(len(db_parent['childs']), 3)
        self.assertTrue(db_parent['childs'][0], child1._id)
        self.assertTrue(db_parent['childs'][1], child2._id)
        self.assertTrue(db_parent['childs'][2], child3._id)

        # test unsaved child, should save when parent is saved
        child4 = NewModel({'name': 'c4'})
        parent.childs.append(child4)

        parent.save()
        db_parent = db.database[new_parent_collection_name].find_one({'_id': parent._id})
        self.assertTrue(len(db_parent['childs']), 4)
        self.assertTrue(db_parent['childs'][3], child4._id)

        # TODO: test mix type child, should raise exception
        # class OtherChildModel(Model):
        #     _name = 'other_child_model'
        #     name: str

        # other_child = OtherChildModel({
        #     'name': 'other_child'
        # }).save()
        # parent.childs.append(other_child)

        # with self.assertRaises(Exception):
        #     parent.save()

    def test_model_non_reference_save(self):
        new_parent_collection_name = 'new_parent_model'
        class NewParentModel(Model):
            name: str
            childs: list[str]

        parent = NewParentModel({
            'name': 'test_parent_non_reference',
            'childs': ['a', 'b', 'c'],
        })

        parent.save()

        db = MongoDatabase()
        db_parent = db.database[new_parent_collection_name].find_one({'_id': parent._id})
        self.assertEqual(db_parent['childs'], ['a', 'b', 'c'])

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

        fetched_parent = NewParentModel.get(parent._id)
        self.assertEqual(len(fetched_parent.childs), 3)
        self.assertEqual(fetched_parent.childs[0]._id, child1._id)
        self.assertEqual(fetched_parent.childs[1]._id, child2._id)
        self.assertEqual(fetched_parent.childs[2]._id, child3._id)

        self.assertTrue(isinstance(fetched_parent.childs[0], NewModel))
        self.assertTrue(isinstance(fetched_parent.childs[1], NewModel))
        self.assertTrue(isinstance(fetched_parent.childs[2], NewModel))

    def test_get_collection_name(self):
        self.assertEqual(NewModel._get_collection_name(), new_model_collection_name)

    def test_type_enum(self):
        class Status(Enum):
            TODO = 1
            IN_PROGRESS = 2
            DONE = 3

        class Todo(Model):
            name: str
            status: Status

        db = MongoDatabase()

        todo1 = Todo()
        todo1.name = 'todo_1'
        todo1.status = Status.TODO
        todo1.save()

        fetched_todo1 = Todo.get(todo1._id)
        db_todo1 = db.database['todo'].find_one({'_id': todo1._id})
        self.assertTrue(isinstance(fetched_todo1.status, Status))
        self.assertEqual(fetched_todo1.status, Status.TODO)
        self.assertEqual(db_todo1['status'], 1)

        todo1.status = Status.DONE
        todo1.save()

        fetched_todo1 = Todo.get(todo1._id)
        db_todo1 = db.database['todo'].find_one({'_id': todo1._id})
        self.assertTrue(isinstance(fetched_todo1.status, Status))
        self.assertEqual(fetched_todo1.status, Status.DONE)
        self.assertEqual(db_todo1['status'], 3)

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

        fetched_restaurant = Restaurant.get(restaurant._id)
        self.assertTrue(isinstance(fetched_restaurant.category, Category))
        self.assertEqual(fetched_restaurant.category._id, thai_food_category._id)
        self.assertEqual(fetched_restaurant.category.name, 'thai')

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
        self.assertIsNotNone(new_model1.numbers)
        self.assertEqual(len(new_model1.numbers), 0)

    def test_update(self):
        new_model1 = NewModel()

        self.assertIsNone(new_model1.name)
        self.assertIsNone(new_model1.active)

        new_model1.name = 'name'
        new_model1.save()
        new_model1_id = new_model1._id

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
        self.assertEqual(new_model1._id, new_model1_id)

        fetched_new_model1 = NewModel.get(new_model1_id)
        self.assertEqual(fetched_new_model1.name, 'altered_name')
        self.assertEqual(fetched_new_model1.active, True)
