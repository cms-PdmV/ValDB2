import axios from "axios"
import { useEffect, useState } from "react"

const getAllTodo = (): Promise<Todo[]> => axios.get('http://localhost:5000/api/todo').then(result => result.data)
const createTodo = (label: string): Promise<void> => axios.post('http://localhost:5000/api/todo/', {
  name: label,
  is_done: false,
})
const deleteTodo = (id: string): Promise<void> => axios.delete(`http://localhost:5000/api/todo/${id}`)
const updateTodo = (id: string, body: object): Promise<void> => axios.put(`http://localhost:5000/api/todo/${id}`, body)

interface TodoListProp {
  id: string,
  isChecked: boolean
  onCheck: (id: string, newCheckedValue: boolean) => void
  onDelete: (id: string) => void
  label: string
}

const TodoList = (prop: TodoListProp) => {
  return (
    <div>
      <input onChange={(e: any) => {console.log(e.target.checked);prop.onCheck(prop.id, e.target.checked)}} checked={prop.isChecked} type="checkbox"/>
      &nbsp;&nbsp;
      <span style={{textDecoration: prop.isChecked? 'line-through' : '', color: prop.isChecked ? 'gray' : 'black'}}>{prop.label}</span>
      &nbsp;&nbsp;
      <span style={{color: 'red', cursor: 'pointer'}} onClick={() => prop.onDelete(prop.id)}>delete</span>
    </div>
  )
}

interface Todo {
  _id: string
  name: string
  is_done: boolean
}

export function TodoPage() {

  const [todos, setTodos] = useState<Todo[]>()
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    updateList()
  }, [])

  const updateList = () => {
    getAllTodo().then(data => {
      console.log(data)
      setTodos(data)
    })
  }

  const createTodoList = () => {
    if (inputValue !== '') {
      createTodo(inputValue).then(_ => {
        setInputValue('')
        updateList()
      })
    }
  }

  const deleteTodoList = (id: string) => {
    deleteTodo(id).then(_ => {
      updateList()
    })
  }

  const toggleTodoList = (id: string, newCheckedValue: boolean) => {
    updateTodo(id, {
      is_done: newCheckedValue
    }).then(_ => {
      updateList()
    })
  }

  const onChangeInput = (e: any) => {
    setInputValue(e.target.value)
  }

  return (
    <div style={{padding: '1rem 2rem'}}>
      <h1>Todo</h1>
      <input placeholder="task name..." onChange={onChangeInput} value={inputValue} onSubmit={createTodoList}/><button onClick={createTodoList}>+</button>
      <div style={{marginTop: '1rem'}}>
        {todos ? 
          todos.map(todo => <TodoList key={todo._id} id={todo._id} isChecked={todo.is_done} onCheck={toggleTodoList} onDelete={deleteTodoList} label={todo.name} />)
        :
          <p>loading...</p>  
        }
      </div>
    </div>
  )
}