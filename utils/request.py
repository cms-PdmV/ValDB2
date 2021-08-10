'''
Request Util
'''

def parse_list_of_tuple(tuple_strings):
    '''
    Parse string k1:v1,k2:v2 to [(k1, v1), (k2, v2)]
    '''
    return [tuple(tuple_string.split(':')) for tuple_string in tuple_strings.split(',') \
        if tuple_string]
