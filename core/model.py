# from ..main import database as default_database
from typing import TypeVar, Union
from bson.objectid import ObjectId
from .database import MongoDatabase

_default_database = MongoDatabase()
_filter_out_object_key = ['_name', 'database']

T = TypeVar('T')

class Model:
    _name: str
    _id: ObjectId

    def __init__(self, data: dict=None, database=_default_database):
        self.database = database
        if data:
            self._set_value_from_data(data)

    def _set_value_from_data(self, data: dict):
        for key, value in data.items():
            if key in self.__annotations__ or key == '_id':
                setattr(self, key, value)

    def _get_data_object(self):
        return {key: value for key, value in self.__dict__.items() if key not in _filter_out_object_key}

    def save(self: T) -> T:
        if hasattr(self, '_id') and self._id:
            self.database.update(self._name, self._id, self._get_data_object())
        else:
            saved_data_id = self.database.create(self._name, self._get_data_object())
            self._id = saved_data_id
        return self

    def get(self: T, id: Union[str, ObjectId]) -> T:
        return self.__class__(self.database.get(self._name, id))

    def query(self: T, query: dict) -> list[T]:
        return [self.__class__(record) for record in self.database.query(self._name, query)]
