from core import TestCase
from models.user import User
from lookup.user_group import UserGroupLookup
from data.group import get_all_groups

group1 = 'Reconstruction.Data.Tracker'
group2 = 'Reconstruction.Data.Ecal'
group3 = 'HLT.FullSim.Top'

class UserGroupLookUpTest(TestCase):

    def setUp(self) -> None:
        self.clean_database()
        self.lookup = UserGroupLookup()
        self.user1 = User({
            'fullname': 'user1',
            'groups': [group1, group2, group3]
        }).save()
        self.user2 = User({
            'fullname': 'user2',
            'groups': [group1]
        }).save()
        User({
            'fullname': 'user3',
            'groups': []
        }).save()
        return super().setUp()

    def test_initialize(self):
        self.assertListEqual(list(self.lookup.table.keys()), get_all_groups())

    def test_update(self):
        self.lookup.clear()
        self.lookup.update()
        self.assertListEqual(self.lookup.table[group1], [self.user1._id, self.user2._id])
        self.assertListEqual(self.lookup.table[group2], [self.user1._id])
        self.assertListEqual(self.lookup.table[group3], [self.user1._id])

    def test_add_user_to_group(self):
        self.lookup.clear()
        self.lookup.add_user_to_group(self.user1._id, group1)
        self.lookup.add_user_to_group(self.user1._id, group2)
        self.lookup.add_user_to_group(self.user1._id, group3)
        self.assertListEqual(self.lookup.table[group1], [self.user1._id])
        self.assertListEqual(self.lookup.table[group2], [self.user1._id])
        self.assertListEqual(self.lookup.table[group3], [self.user1._id])

    def test_remove_user_from_group(self):
        self.lookup.clear()
        self.lookup.add_user_to_group(self.user1._id, group1)
        self.lookup.add_user_to_group(self.user1._id, group2)
        self.lookup.remove_user_from_group(self.user1._id, group1)
        self.assertListEqual(self.lookup.table[group1], [])
        self.assertListEqual(self.lookup.table[group2], [self.user1._id])