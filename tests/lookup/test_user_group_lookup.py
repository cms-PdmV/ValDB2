from core import TestCase
from models.user import User, UserRole
from lookup.user_group import UserGroupLookup
from data.group import get_all_groups

administrator_key = 'Administrator'
group1 = 'Reconstruction.Data.Tracker'
group2 = 'Reconstruction.Data.Ecal'
group3 = 'HLT.FullSim.Top'

class UserGroupLookUpTest(TestCase):

    def setUp(self) -> None:
        self.clean_database()
        self.lookup = UserGroupLookup()
        self.admin = User({
            'fullname': 'admin1',
            'email': 'admin@cern.ch',
            'role': UserRole.ADMIN,
            'groups': [group1, group2, group3]
        }).save()
        self.user1 = User({
            'fullname': 'user1',
            'email': 'user1@cern.ch',
            'role': UserRole.VALIDATOR,
            'groups': [group1, group2, group3]
        }).save()
        self.user2 = User({
            'fullname': 'user2',
            'email': 'user2@cern.ch',
            'role': UserRole.VALIDATOR,
            'groups': [group1]
        }).save()
        User({
            'fullname': 'user3',
            'email': 'user3@cern.ch',
            'role': UserRole.USER,
            'groups': []
        }).save()
        return super().setUp()

    def test_initialize(self):
        self.assertListEqual(list(self.lookup.table.keys()), [administrator_key] + get_all_groups())

    def test_update(self):
        self.lookup.clear()
        self.lookup.update()
        self.assertListEqual(self.lookup.table[administrator_key], [self.admin.id])
        self.assertListEqual(self.lookup.table[group1], [self.user1.id, self.user2.id])
        self.assertListEqual(self.lookup.table[group2], [self.user1.id])
        self.assertListEqual(self.lookup.table[group3], [self.user1.id])

    def test_add_user_to_group(self):
        self.lookup.clear()
        self.lookup.add_user_to_group(self.user1.id, group1)
        self.lookup.add_user_to_group(self.user1.id, group2)
        self.lookup.add_user_to_group(self.user1.id, group3)
        self.assertListEqual(self.lookup.table[group1], [self.user1.id])
        self.assertListEqual(self.lookup.table[group2], [self.user1.id])
        self.assertListEqual(self.lookup.table[group3], [self.user1.id])

    def test_remove_user_from_group(self):
        self.lookup.clear()
        self.lookup.add_user_to_group(self.user1.id, group1)
        self.lookup.add_user_to_group(self.user1.id, group2)
        self.lookup.remove_user_from_group(self.user1.id, group1)
        self.assertListEqual(self.lookup.table[group1], [])
        self.assertListEqual(self.lookup.table[group2], [self.user1.id])