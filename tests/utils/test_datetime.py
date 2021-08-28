from datetime import datetime

from core import TestCase
from utils.datetime import format_datetime

class DateTimeUtilTest(TestCase):

    def test_format_datetime(self):
        test_datetime = datetime(year=2000, month=10, day=1, hour=8, minute=0)
        expected = '01/10/2000, 08:00'
        self.assertEqual(expected, format_datetime(test_datetime))