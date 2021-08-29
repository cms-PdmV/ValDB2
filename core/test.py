'''
Test case for unit test
'''
import os
import unittest

from dotenv import load_dotenv

from .database import get_database


DATABASE_NAME_KEY = 'DATABASE_NAME'

class TestCase(unittest.TestCase):
    '''
    Test case for unittest. Clear database on setup.
    '''

    @staticmethod
    def _check_database_name():
        '''
        Check that test database should not be the same as running database
        '''
        with open('.env', encoding='utf-8') as file:
            for line in file:
                line = line.split('=')
                if line[0] == DATABASE_NAME_KEY:
                    database_name_dotenv = line[1].strip()
                    database_name_env = os.getenv(DATABASE_NAME_KEY)
                    if database_name_dotenv == database_name_env:
                        raise Exception(
                            'Test database is the same as application database.' \
                            ' Consider using different name for tests'
                        )

    @staticmethod
    def clean_database():
        '''
        Remove all data in test database
        '''
        database = get_database()
        database.client.drop_database(os.getenv(DATABASE_NAME_KEY))

    def __init__(self, *args, **kwargs):
        load_dotenv()
        self._check_database_name()
        self.clean_database()
        super().__init__(*args, **kwargs)
