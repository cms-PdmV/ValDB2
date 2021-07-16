from bson.objectid import ObjectId
from data.group import get_all_groups
from models.user import User


class UserGroupLookup():

    # ensure single instance
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super().__new__(cls)
        return cls.instance

    def __init__(self):
        self.table = {}
        self._initialize_table()

    def _initialize_table(self):
        self.table = {}
        for group in get_all_groups():
            self.table[group] = []

    def update(self):
        '''
        Update user group lookup table
        '''
        users = User.query({})
        self._initialize_table()
        for user in users:
            for group in user.groups:
                self.table[group].append(user._id)

    def add_user_to_group(self, user_id: ObjectId, group: str):
        if user_id not in self.table[group]:
            self.table[group].append(user_id)

    def remove_user_from_group(self, user_id: ObjectId, group: str):
        self.table[group].remove(user_id)

    def clear(self):
        self._initialize_table()
