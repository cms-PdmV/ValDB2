from core import Model

class String(str):

    def __init__(self, max: int) -> str:
        return self


class Todo(Model):
    name: String(5)
    is_done: bool


todo = Todo()

todo.name = 