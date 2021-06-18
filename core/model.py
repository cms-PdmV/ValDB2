from typing import TypeVar, Union, get_args
import re
from bson.objectid import ObjectId
from .database import get_database

_filter_out_load_object_key = ['_database']
_filter_out_store_object_key = _filter_out_load_object_key + ['_id']

T = TypeVar('T')

class Model:
    _id: ObjectId

    def __init__(self, data: dict=None):
        database = get_database()
        self._database = database()
        if data:
            self._set_value_from_data(data)

    def _set_value_from_data(self, data: dict):
        for key, value in data.items():
            if key in self.__annotations__ or key == '_id':
                setattr(self, key, value)

    def _get_data_load_object(self, data: dict) -> dict:
        data_load_object = {}
        for key in data:
            if key in _filter_out_load_object_key or key not in data:
                continue

            value = data[key]
            if self._is_reference_field(key):
                elements = []
                reference_model = self._get_reference_model_of_field(key)
                for element in value:
                    elements.append(reference_model().get(element))
                data_load_object[key] = elements
            else:
                data_load_object[key] = value
        return data_load_object

    def _get_data_store_object(self) -> dict:
        data_store_object = {}
        for key in self.__dict__.keys():
            if key in _filter_out_store_object_key:
                continue

            value = self.__dict__[key]
            if self._is_reference_field(key):
                element_ids = []
                for element in value:
                    if not element._is_saved():
                        element.save()
                    element_ids.append(element._id)
                data_store_object[key] = element_ids
            else:
                data_store_object[key] = value
        return data_store_object

    def _is_saved(self) -> bool:
        return hasattr(self, '_id') and self._id
    
    def _is_reference_field(self, field: str) -> bool:
        return field in self.__annotations__ and len(get_args(self.__annotations__[field])) == 1 and isinstance(get_args(self.__annotations__[field])[0](), Model)
    
    def _get_reference_model_of_field(self, field: str):
        return get_args(self.__annotations__[field])[0]

    def save(self: T) -> T:
        if self._is_saved():
            self._database.update(self._get_collection_name(), self._id, self._get_data_store_object())
        else:
            saved_data_id = self._database.create(self._get_collection_name(), self._get_data_store_object())
            self._id = saved_data_id
        return self

    @classmethod
    def _get_collection_name(cls: T):
        object_name = cls.__name__
        snake_case_name = re.sub(r'(?<!^)(?=[A-Z])', '_', object_name).lower()
        return snake_case_name
    
    @classmethod
    def get(cls: T, id: Union[str, ObjectId]) -> T:
        class_instance = cls()
        return cls(class_instance._get_data_load_object(class_instance._database.get(cls._get_collection_name(), id)))

    @classmethod
    def query(cls: T, query: dict) -> list[T]:
        class_instance = cls()
        return [cls(class_instance._get_data_load_object(record)) for record in class_instance._database.query(cls._get_collection_name(), query)]

    def unlink(self):
        self._database.delete(self._get_collection_name(), self._id)
        self._id = None

    def __repr__(self) -> str:
        field_data_keys = [key for key in self.__dict__ if key not in _filter_out_load_object_key]
        sorted_field_data = {key: self.__dict__[key] for key in sorted(field_data_keys)}
        return f"<{self._get_collection_name()} {sorted_field_data}>"
