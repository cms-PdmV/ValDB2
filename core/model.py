from datetime import datetime
from enum import Enum
from typing import TypeVar, Union, get_args
import re
from bson.objectid import ObjectId
from flask_restx import fields

from .database import get_database

PREFILLED_FIELDS = ['id', 'created_at', 'updated_at']
FILTER_OUT_LOAD_OBJECT_KEY = ['_fields']
FILTER_OUT_STORE_OBJECT_KEY = FILTER_OUT_LOAD_OBJECT_KEY + ['id']
_database = get_database()

T = TypeVar('T')

class CustomField(fields.Raw):
    '''
    Custom restx field for unsupported type
    '''
    __schema_type__ = 'some-type'
    __schema_format__ = 'some-format'
    __schema_example__ = {}
    def __init__(self, type_text: str, format_text: str, *args, **kwargs):
        self.__schema_type__ = type_text
        self.__schema_format__ = format_text
        super().__init__(*args, **kwargs)

class Model():
    '''
    Base ORM model.
    Each object includes id, created_at, updated_up fields.
    '''

    id: ObjectId
    created_at: datetime
    updated_at: datetime

    def __init__(self, data=None):
        self._fields = self._get_fields()
        self._set_fields_from_data(data)

    def _set_fields_from_data(self, data: dict):
        '''
        Set attribute of object from data dictionary.
        '''
        for key in self._fields:
            setattr(self, key, data.get(key) if data else None)

    @classmethod
    def _get_data_load_object(cls, data: dict) -> dict:
        '''
        Get load data dictionary for converting to python object.
        '''
        data_load_object = {}
        if not data:
            return data_load_object
        for key, value in data.items():
            if key == '_id':
                data_load_object['id'] = value
                continue
            if key in FILTER_OUT_LOAD_OBJECT_KEY or key not in cls._get_fields():
                continue

            if key in PREFILLED_FIELDS:
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
        '''
        Get store data dictionary for storing in database.
        '''
        data_store_object = {}
        for key, value in data.items():
            if key in FILTER_OUT_STORE_OBJECT_KEY:
                continue

            if value is None:
                continue
            if cls._is_reference_field(key): # is one2many reference
                element_ids = []
                for element in value:
                    if not element.is_saved():
                        element.save()
                    element_ids.append(element.id)
                data_store_object[key] = element_ids
            elif isinstance(value, Model): # is many2one reference
                if not value.is_saved():
                    value.save()
                data_store_object[key] = value.id
            elif isinstance(value, Enum): # is enum
                data_store_object[key] = value.value
            else: # is general type
                data_store_object[key] = value
        return data_store_object

    def is_saved(self) -> bool:
        '''
        Retrun True if this record is saved in database.
        '''
        return hasattr(self, 'id') and self.id

    @classmethod
    def _is_reference_field(cls, field: str) -> bool:
        '''
        Retrun True if this record is a reference field.
        '''
        return field in cls.__annotations__ and \
            len(get_args(cls.__annotations__[field])) == 1 and \
            issubclass(get_args(cls.__annotations__[field])[0], Model)

    @classmethod
    def _get_reference_model_of_field(cls, field: str):
        '''
        Get reference field's class.
        '''
        return get_args(cls.__annotations__[field])[0]

    @classmethod
    def _get_fields(cls):
        '''
        All fields in object including prefilled fields.
        '''
        return list(cls.__annotations__.keys()) + PREFILLED_FIELDS

    def save(self: T) -> T:
        '''
        Save data to database. Create new record is the data is not existed.
        '''
        current_utc_time = datetime.utcnow()
        self.updated_at = current_utc_time
        if self.is_saved():
            _database.update(self.get_collection_name(), self.id,
                self._get_data_store_object(self.__dict__)
            )
        else:
            self.created_at = current_utc_time
            saved_data_id = _database.create(self.get_collection_name(),
                self._get_data_store_object(self.__dict__)
            )
            self.id = saved_data_id
        return self

    def update(self: T, data: dict) -> T:
        '''
        Update the object with data dictionary and save to database.
        '''
        for key in data:
            if key in self.__annotations__:
                setattr(self, key, data[key])
        self.save()
        return self

    @classmethod
    def get_collection_name(cls: T):
        '''
        Collection name in database of current model.
        '''
        object_name = cls.__name__
        snake_case_name = re.sub(r'(?<!^)(?=[A-Z])', '_', object_name).lower()
        return snake_case_name

    @classmethod
    def get(cls: T, id: Union[str, ObjectId]) -> T:
        '''
        Get object by their id.
        '''
        return cls(cls._get_data_load_object(_database.get(cls.get_collection_name(), id)))

    @classmethod
    def query(cls: T, query: dict, sort=None) -> list[T]:
        '''
        Query objects from database.
        '''
        return [cls(cls._get_data_load_object(record))
            for record in _database.query(cls.get_collection_name(), query, sort)
        ]

    def unlink(self):
        '''
        Remove record from the database
        '''
        _database.delete(self.get_collection_name(), self.id)
        self.id = None

    def dict(self) -> dict:
        '''
        Return data object as dictionary. Can be used for serialization.
        '''
        data_as_dict = {}

        for key in self._fields:
            value = getattr(self, key)
            data_as_dict[key] = self._serialize(value)
        return data_as_dict

    def parse_datetime(self, datetime_format="%Y-%m-%d"):
        '''
        Update datetime from request in the model
        '''
        for field in self._fields:
            if hasattr(self, field) and self.__annotations__.get(field) is datetime and \
                isinstance(getattr(self, field), str):
                datetime_object = datetime.strptime(getattr(self, field), datetime_format)
                setattr(self, field, datetime_object)

    def _serialize(self, value):
        '''
        Get rerializable object.
        '''
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
        '''
        Get Flast Restx field
        '''
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
        restx_fields['id'] = fields.String
        restx_fields['created_at'] = fields.String
        restx_fields['updated_at'] = fields.String
        for key in cls.__annotations__:
            type_of_field = cls.__annotations__[key]
            restx_fields[key] = cls._get_flask_restx_field(type_of_field)
        return restx_fields

    def __repr__(self) -> str:
        field_data_keys = [
            key for key in self.__dict__
            if key not in FILTER_OUT_LOAD_OBJECT_KEY
        ]
        sorted_field_data = {key: self.__dict__[key] for key in sorted(field_data_keys)}
        return f"<{self.get_collection_name()} {sorted_field_data}>"
