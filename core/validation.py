'''
Core validation
Common validation rule for model
'''
import re

def readable(text):
    '''
    Return readable field name
    From 'snake_case' to 'Title Case'
    '''
    return ' '.join([str.title(word) for word in text.split('_')])

VALID = (True, None)

def required(error='{} is a required field'):
    '''
    Required field, non empty list
    '''
    def validate(field, value, model=None): # pylint: disable=W0613
        if value:
            return VALID
        return False, error.format(readable(field))
    return validate

def regex(expression, example=None, error='{} has an incorrect format{}'):
    '''
    Field match the regular expression
    '''
    def validate(field, value, model=None): # pylint: disable=W0613
        if re.match(expression, value or ''):
            return VALID
        return False, error.format(
            readable(field),
            f'. The example correct format is: {example}' if example else '')
    return validate

def unique(error='{} is not unique'):
    '''
    Unique in database
    '''
    def validate(field, value, model):
        if not model.query_one({field: value}):
            return VALID
        return False, error.format(readable(field))
    return validate
