'''
Group data util
'''

def get_subcategory_from_group(group_path):
    '''
    Get subcategory string from group path string
    '''
    return '.'.join(group_path.split('.')[:2])
