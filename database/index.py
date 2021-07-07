from core.database import get_database

def database_index_setup():
    db = get_database()
    db.database['campaign'].create_index('name')

    # TODO: add index for report collection