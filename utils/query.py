'''
Database query helper
'''

import pymongo

def build_query(fields, query_params):
    '''
    Build mongodb query from search keyword that matched specific fields
    '''
    database_query = {}
    if query_params.get('search') and query_params.get('search') != '':
        search = query_params.get('search')
        database_query = {
        '$or': [
            {field: { '$regex': search, '$options': 'i' }}
        for field in fields]
    }
    return database_query

def build_sort(sorting_fields):
    '''
    Build sorting option for pymongo
    sorting_fields: (field: string, type: 'asc' | 'desc')[]
    '''
    pymongo_sorting_type = {
        'asc': pymongo.ASCENDING,
        'desc': pymongo.DESCENDING,
    }
    return [(field, pymongo_sorting_type[sort_type]) for field, sort_type in sorting_fields \
        if sort_type]

def add_skip_and_limit(query_result, query_params):
    '''
    Add skip, limit to query result
    '''
    if 'skip' in query_params:
        skip = int(query_params.get('skip'))
        query_result.skip(skip)
    if 'limit' in query_params:
        limit = int(query_params.get('limit'))
        query_result.limit(limit)

def serialize_raw_query(raw_query) -> list[object]:
    '''
    Serialize mongodb query to JSON
    '''
    return [{
        'id': str(record['_id']),
        **{key: record[key] for key in record if key != '_id'},
    } for record in list(raw_query)]
