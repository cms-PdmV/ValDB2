from unittest import TestCase
from core.database import MongoDatabase

class TestDatabase(TestCase):

    def test_database_is_singleton(self):
        instance1 = MongoDatabase()
        instance2 = MongoDatabase()
        self.assertTrue(instance1 is instance2)
        self.assertTrue(instance1.database is instance2.database)
