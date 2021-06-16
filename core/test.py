from logging import log
import unittest
from dotenv import load_dotenv
from .database import get_database
import os


_database_name_key = 'DATABASE_NAME'

class TestCase(unittest.TestCase):

    def _check_database_name(self):
        with open('.env') as f:
            for line in f:
                line = line.split('=')
                if line[0] == _database_name_key:
                    database_name_dotenv = line[1].strip()
                    database_name_env = os.getenv(_database_name_key)
                    if database_name_dotenv == database_name_env:
                        raise Exception('Test database is the same as application database. Consider using different name for tests')

    def _clean_database(self):
        database = get_database()()
        database.client.drop_database(os.getenv(_database_name_key))

    def __init__(self, *args, **kwargs):
        load_dotenv()
        self._check_database_name()
        self._clean_database()
        super().__init__(*args, **kwargs)