from datetime import datetime
from enum import Enum
from typing import TypeVar, Union, get_args
import re
from bson.objectid import ObjectId
from flask_restx import fields
from .database import get_database

_prefilled_fields = ['_id', 'created_at', 'updated_at']
_filter_out_load_object_key = ['_fields']
_filter_out_store_object_key = _filter_out_load_object_key + ['_id']
_database = get_database()

T = TypeVar('T')

class CustomField(fields.Raw):
    __schema_type__ = 'some-type'
    __schema_format__ = 'some-format'
    __schema_example__ = {}
    def __init__(self, type: str, format: str, *args, **kwargs):
        self.__schema_type__ = type
        self.__schema_format__ = format
        super().__init__(*args, **kwargs)

class Model():
    _id: ObjectId
    created_at: datetime
    updated_at: datetime

    def __init__(self, data: dict=None):
        self._fields = self._get_fields()
        self._set_fields_from_data(data)

    def _set_fields_from_data(self, data: dict):
        for key in self._fields:
            setattr(self, key, data.get(key) if data else None)

    @classmethod
    def _get_data_load_object(cls, data: dict) -> dict:
        data_load_object = {}
        if not data:
            return data_load_object
        for key, value in data.items():
            if key in _filter_out_load_object_key or key not in cls._get_fields():
                continue

            if key in _prefilled_fields: # is _id
                data_load_object[key] = value
            elif cls._is_reference_field(key): # is one2many reference
                elements = []
                reference_model = cls._get_reference_model_of_field(key)
                for element in value:
                    elements.append(reference_model.get(element))
                data_load_object[key] = elements
            elif issubclass(cls.__annotations__[key], Model): # is many2one reference
                data_load_object[key] = cls.__annotations__[key].get(value)
            elif issubclass(cls.__annotations__[key], Enum): # is enum
                data_load_object[key] = cls.__annotations__[key](value)
            else: # is general type
                data_load_object[key] = value
        return data_load_object

    @classmethod
    def _get_data_store_object(cls, data: dict) -> dict:
        data_store_object = {}
        for key, value in data.items():
            if key in _filter_out_store_object_key:
                continue

            if value is None:
                continue
            if cls._is_reference_field(key): # is one2many reference
                element_ids = []
                for element in value:
                    if not element._is_saved():
                        element.save()
                    element_ids.append(element._id)
                data_store_object[key] = element_ids
            elif isinstance(value, Model): # is many2one reference
                if not value._is_saved():
                    value.save()
                data_store_object[key] = value._id
            elif isinstance(value, Enum): # is enum
                data_store_object[key] = value.value
            else: # is general type
                data_store_object[key] = value
        return data_store_object

    def _is_saved(self) -> bool:
        return hasattr(self, '_id') and self._id
    
    @classmethod
    def _is_reference_field(cls, field: str) -> bool:
        return field in cls.__annotations__ and len(get_args(cls.__annotations__[field])) == 1 and issubclass(get_args(cls.__annotations__[field])[0], Model)
    
    @classmethod
    def _get_reference_model_of_field(cls, field: str):
        return get_args(cls.__annotations__[field])[0]

    @classmethod
    def _get_fields(cls):
        return list(cls.__annotations__.keys()) + _prefilled_fields

    def save(self: T) -> T:
        current_utc_time = datetime.utcnow()
        self.updated_at = current_utc_time
        if self._is_saved():
            _database.update(self._get_collection_name(), self._id, self._get_data_store_object(self.__dict__))
        else:
            self.created_at = current_utc_time
            saved_data_id = _database.create(self._get_collection_name(), self._get_data_store_object(self.__dict__))
            self._id = saved_data_id
        return self

    def update(self: T, data: dict) -> T:
        for key in data:
            if key in self.__annotations__:
                setattr(self, key, data[key])
        self.save()
        return self

    @classmethod
    def _get_collection_name(cls: T):
        object_name = cls.__name__
        snake_case_name = re.sub(r'(?<!^)(?=[A-Z])', '_', object_name).lower()
        return snake_case_name
    
    @classmethod
    def get(cls: T, id: Union[str, ObjectId]) -> T:
        return cls(cls._get_data_load_object(_database.get(cls._get_collection_name(), id)))

    @classmethod
    def query(cls: T, query: dict, sort=None) -> list[T]:
        return [cls(cls._get_data_load_object(record)) for record in _database.query(cls._get_collection_name(), query, sort)]

    def unlink(self):
        '''
        Remove record from the database
        '''
        _database.delete(self._get_collection_name(), self._id)
        self._id = None

    def dict(self) -> dict:
        '''
        Return data object as dictionary. Can be used for serialization. 
        '''
        data_as_dict = {}
        
        for key in self._fields:
            value = getattr(self, key)
            data_as_dict[key] = self._serialize(value)
        return data_as_dict

    def parse_datetime(self, format="%Y-%m-%d"):
        '''
        Update datetime from request in the model
        '''
        for field in self._fields:
            if hasattr(self, field) and self.__annotations__.get(field) is datetime and isinstance(getattr(self, field), str):
                datetime_object = datetime.strptime(getattr(self, field), format)
                setattr(self, field, datetime_object)

    def _serialize(self, value):
        serialized_data = None
        if isinstance(value, ObjectId):
            serialized_data = str(value)
        elif isinstance(value, datetime):
            serialized_data = str(value)
        elif isinstance(value, Model):
            serialized_data = value.dict()
        elif isinstance(value, Enum):
            serialized_data = value.value
        elif isinstance(value, list):
            serialized_data = []
            for each_value in value:
                serialized_data.append(self._serialize(each_value))
        else:
            serialized_data = value
        return serialized_data

    @classmethod
    def _get_flask_restx_field(cls, type_of_field):
        is_list = len(get_args(type_of_field)) == 1

        if type_of_field is str:
            restx_field = fields.String
        elif type_of_field is int:
            restx_field = fields.Integer
        elif type_of_field is float:
            restx_field = fields.Float
        elif type_of_field is datetime:
            restx_field = fields.String
        elif type_of_field is bool:
            restx_field = fields.Boolean
        elif is_list:
            restx_field = fields.List(cls._get_flask_restx_field(get_args(type_of_field)[0]))
        elif type_of_field.__base__ is Enum:
            restx_field = fields.Integer
        elif type_of_field.__base__ is Model:
            restx_field = CustomField('Model', type_of_field.__name__)
        else:
            restx_field = CustomField('Unknown', '')
        return restx_field

    @classmethod
    def get_flask_restx_fields(cls) -> dict:
        '''
        Return Flask RestX fields for model documentation
        '''
        restx_fields = {}
        restx_fields['_id'] = fields.String
        restx_fields['created_at'] = fields.String
        restx_fields['updated_at'] = fields.String
        for key in cls.__annotations__:
            type_of_field = cls.__annotations__[key]
            restx_fields[key] = cls._get_flask_restx_field(type_of_field)
        return restx_fields

    def __repr__(self) -> str:
        field_data_keys = [key for key in self.__dict__ if key not in _filter_out_load_object_key]
        sorted_field_data = {key: self.__dict__[key] for key in sorted(field_data_keys)}
        return f"<{self._get_collection_name()} {sorted_field_data}>"
