from core import TestCase
from models.user import User, UserRole
from lookup.user_group import UserGroupLookup
from data.group import get_all_groups
from api.user_group import UserGroupController

administrator_key = 'Administrator'
group1 = 'Reconstruction.Data.Tracker'
group2 = 'Reconstruction.Data.Ecal'
group3 = 'HLT.FullSim.Top'

class UserGroupAPITest(TestCase):

    def setUp(self) -> None:
        self.clean_database()
        self.lookup = UserGroupLookup()
        self.admin = User({
            'fullname': 'admin1',
            'role': UserRole.ADMIN,
            'groups': [group1, group2, group3],
            'email': 'admin1@cern.ch',
        }).save()
        self.user1 = User({
            'fullname': 'user1',
            'role': UserRole.VALIDATOR,
            'groups': [group1, group2, group3],
            'email': 'user1@cern.ch',
        }).save()
        self.user2 = User({
            'fullname': 'user2',
            'role': UserRole.VALIDATOR,
            'groups': [group1],
            'email': 'user2@cern.ch',
        }).save()
        self.user3 = User({
            'fullname': 'user3',
            'role': UserRole.USER,
            'groups': [],
            'email': 'user3@cern.ch',
        }).save()
        self.lookup.update()
        return super().setUp()

    def test_should_add_user_if_new_email(self):
        # add validator
        email = 'newuser@cern.ch'
        UserGroupController.add_user_to_group(email, group1)
        saved_user = User.query_one({'email': email})
        self.assertEqual(saved_user.fullname, None)
        self.assertEqual(saved_user.email, email)
        self.assertEqual(saved_user.role, UserRole.VALIDATOR)
        self.assertListEqual(saved_user.groups, [group1])
        self.assertIn(saved_user.id, self.lookup.table[group1])

        # add admin
        admin_email = 'adminuser@cern.ch'
        UserGroupController.add_user_to_group(admin_email, administrator_key)
        saved_admin_user = User.query_one({'email': admin_email})
        self.assertEqual(saved_admin_user.fullname, None)
        self.assertEqual(saved_admin_user.email, admin_email)
        self.assertEqual(saved_admin_user.role, UserRole.ADMIN)
        self.assertListEqual(saved_admin_user.groups, get_all_groups())
        self.assertIn(saved_admin_user.id, self.lookup.table[administrator_key])

        # should not add twice
        UserGroupController.add_user_to_group(email, group1)
        result = User.query({'email': email})
        self.assertEqual(len(result), 1)
        self.assertListEqual(result[0].groups, [group1])
        self.assertEqual(self.lookup.table[group1].count(result[0].id), 1)

    def test_add_user_to_group(self):
        UserGroupController.add_user_to_group(self.user3.email, group1)
        user3 = User.get(self.user3.id)
        self.assertEqual(user3.role, UserRole.VALIDATOR)
        self.assertListEqual(user3.groups, [group1])
        self.assertIn(user3.id, self.lookup.table[group1])

    def test_remove_user_to_group(self):
        UserGroupController.remove_user_from_group(self.user1.id, group1)
        user1 = User.get(self.user1.id)
        self.assertEqual(user1.role, UserRole.VALIDATOR)
        self.assertListEqual(user1.groups, [group2, group3])
        self.assertNotIn(user1.id, self.lookup.table[group1])
        self.assertIn(user1.id, self.lookup.table[group2])
        self.assertIn(user1.id, self.lookup.table[group3])

    def test_should_not_allow_to_add_admin_to_validator_group(self):
        with self.assertRaises(Exception):
            UserGroupController.add_user_to_group(self.admin.email, group1)
