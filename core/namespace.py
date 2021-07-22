from flask_restx import Namespace as NamespaceBase
from flask_restx.model import Model
from .model import Model as CoreModel

class Namespace(NamespaceBase):

    def model(self, model: CoreModel) -> Model:
        return super().model(model.__name__, model.get_flask_restx_fields())
