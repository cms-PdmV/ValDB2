'''
User group lookup table
key: group path string
value: users in the group
'''
from bson.objectid import ObjectId

from data.group import get_all_groups
from models.user import User, UserRole


ADMINISTRATOR_KEY = 'Administrator'

class UserGroupLookup():
    '''
    User group lookup table
    key: group path string
    value: users in the group
    '''

    # ensure single instance
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super().__new__(cls)
            cls.table = {}
        return cls.instance

    def initialize(self):
        '''
        Setup lookup table
        '''
        self.table = {}
        for group in [ADMINISTRATOR_KEY] + get_all_groups():
            self.table[group] = []

    def update(self):
        '''
        Update user group lookup table
        '''
        administrators = User.query({'role': UserRole.ADMIN.value})
        validators = User.query({'role': UserRole.VALIDATOR.value})
        self.initialize()
        self.table[ADMINISTRATOR_KEY] = [administrator.id for administrator in administrators]
        for validator in validators:
            for group in validator.groups:
                if group in self.table:
                    self.table[group].append(validator.id)

    def add_user_to_group(self, user_id: ObjectId, group: str):
        '''
        Add user to group
        '''
        if user_id not in self.table[group]:
            self.table[group].append(user_id)

    def remove_user_from_group(self, user_id: ObjectId, group: str):
        '''
        Remove user from group
        '''
        self.table[group].remove(user_id)

    def clear(self):
        '''
        Clear all value in the table
        '''
        self.initialize()
