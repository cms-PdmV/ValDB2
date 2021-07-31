from werkzeug.exceptions import BadRequest

from core.model import Model
from core.test import TestCase
from core.validation import required, regex, unique

EMAIL_REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
EMAIL_EXAMPLE = 'example@cern.ch'

NAME_REQUIRE_ERROR = 'Name is a required field'
NAME_FORMAT_ERROR = 'Name has an incorrect format'
EMAIL_FORMAT_ERROR = 'User Email has an incorrect format'
AUTHORS_REQUIRE_ERROR = 'Specific one or more authors'
REPORT_ID_UNIQUE_ERROR = 'Report Id is not unique'

class TestModel(Model):
    name: str
    user_email: str
    description: str
    report_id: str
    authors: list[str]

    _validation = {
        'name': [
            required(), 
            regex('report')
        ],
        'user_email': [
            regex(EMAIL_REGEX, example=EMAIL_EXAMPLE)
        ],
        'authors': [
            required(error=AUTHORS_REQUIRE_ERROR)
        ],
        'report_id': [
            unique()
        ],
    }

class ValidationTest(TestCase):

    def _test_model_validation(self, model, includes, excludes):
        try:
            model.validate()
        except BadRequest as error:
            for text in includes:
                self.assertIn(text, str(error))
            for text in excludes:
                self.assertNotIn(text, str(error))

    def test_validation(self):
        report = TestModel()
        self._test_model_validation(report,
            includes=[NAME_REQUIRE_ERROR, NAME_FORMAT_ERROR, EMAIL_FORMAT_ERROR, EMAIL_EXAMPLE, AUTHORS_REQUIRE_ERROR],
            excludes=[REPORT_ID_UNIQUE_ERROR])

        TestModel({
            'name': 'report_init',
            'user_email': 'init@cern.ch',
            'authors': ['a', 'b'],
            'report_id': 'id',
        }).save()

        report.report_id = 'id'

        self._test_model_validation(report,
            includes=[NAME_REQUIRE_ERROR, NAME_FORMAT_ERROR, EMAIL_FORMAT_ERROR, EMAIL_EXAMPLE, AUTHORS_REQUIRE_ERROR, REPORT_ID_UNIQUE_ERROR],
            excludes=[])

        report.name = ''
        report.authors = []

        self._test_model_validation(report,
            includes=[NAME_REQUIRE_ERROR, NAME_FORMAT_ERROR, EMAIL_FORMAT_ERROR, EMAIL_EXAMPLE, AUTHORS_REQUIRE_ERROR, REPORT_ID_UNIQUE_ERROR],
            excludes=[])

        report.name = 'incorrect_format'

        self._test_model_validation(report,
            includes=[NAME_FORMAT_ERROR, EMAIL_FORMAT_ERROR, EMAIL_EXAMPLE, AUTHORS_REQUIRE_ERROR, REPORT_ID_UNIQUE_ERROR],
            excludes=[NAME_REQUIRE_ERROR])

        report.authors = ['author a']

        self._test_model_validation(report,
            includes=[NAME_FORMAT_ERROR, EMAIL_FORMAT_ERROR, EMAIL_EXAMPLE, REPORT_ID_UNIQUE_ERROR],
            excludes=[NAME_REQUIRE_ERROR, AUTHORS_REQUIRE_ERROR])

        report.name = 'report1'
        report.user_email = 'usermail@cern.ch'

        self._test_model_validation(report,
            includes=[REPORT_ID_UNIQUE_ERROR],
            excludes=[NAME_REQUIRE_ERROR, NAME_FORMAT_ERROR, EMAIL_FORMAT_ERROR, EMAIL_EXAMPLE, AUTHORS_REQUIRE_ERROR])

        report.report_id = 'id2'

        try:
            report.validate()
        except BadRequest:
            self.fail('Should not raise exception when all fields is valid')

    def _test_validation_rule(self, rule, valids, invalids):
        for value in valids:
            valid, message = rule('', value)
            self.assertTrue(valid, f'Expected valid: {value}')
            self.assertIsNone(message)
        for value in invalids:
            valid, message = rule('', value)
            self.assertFalse(valid, f'Expected invalid: {value}')
            self.assertIsNotNone(message)

    def test_required(self):
        valids = ['string', 'aaa', ' ', ['a', 'b', 'c']]
        invalids = [None, '', []]
        self._test_validation_rule(required(), valids, invalids)

    def test_regex(self):
        expression = r'[0-9]{1,4}_[0-9]{1,3}_[0-9]{1,3}.{0,20}'
        valids = ['2021_05_12.testtest', '1_2_3.abc']
        invalids = [None, '', 'test', '.test', '55.tt']
        self._test_validation_rule(regex(expression), valids, invalids)
