from bson.objectid import ObjectId
from data.group import get_all_groups
from models.user import User, UserRole


# TODO: add logging
administrator_key = 'Administrator'

class UserGroupLookup():

    # ensure single instance
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super().__new__(cls)
            cls.table = {}
        return cls.instance

    def initialize(self):
        self.table = {}
        for group in [administrator_key] + get_all_groups():
            self.table[group] = []

    def update(self):
        '''
        Update user group lookup table
        '''
        administrators = User.query({'role': UserRole.ADMIN.value})
        validators = User.query({'role': UserRole.VALIDATOR.value})
        self.initialize()
        self.table[administrator_key] = [administrator._id for administrator in administrators]
        for validator in validators:
            for group in validator.groups:
                self.table[group].append(validator._id)

    def add_user_to_group(self, user_id: ObjectId, group: str):
        if user_id not in self.table[group]:
            self.table[group].append(user_id)

    def remove_user_from_group(self, user_id: ObjectId, group: str):
        self.table[group].remove(user_id)

    def clear(self):
        self.initialize()
