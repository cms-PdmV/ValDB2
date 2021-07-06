from core.database import get_database

def database_index_setup():
    database = get_database()
    db = database()
    db.database['campaign'].create_index('name')