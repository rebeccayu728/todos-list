import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import * as todoAPI from './todoAPI'

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export interface TodoState {
  todos: Array<Todo> | null
  filter: 'all' | 'completed' | 'active'
  status: 'idle' | 'loading' | 'failed'
  addTodoStatus: 'idle' | 'loading' | 'failed'
  patchTodoStatus: 'idle' | 'loading' | 'failed'
  deleteTodoStatus: 'idle' | 'loading' | 'failed'
}

const MAX_TODO_LIST = 10
const initialState: TodoState = {
  todos: null,
  filter: 'all',
  status: 'idle',
  addTodoStatus: 'idle',
  patchTodoStatus: 'idle',
  deleteTodoStatus: 'idle',
}

export const fetchTodosAsync = createAsyncThunk(
  'todo/fetchTodos',
  async (userId ?: number) => {
    const response = await todoAPI.fetchTodos(userId)
    return response
  }
)

export const addTodoAsync = createAsyncThunk(
  'todo/addTodo',
  async (title : string) => {
    const todo = {
      title,
      id: 0,
      userId: 1,
      completed: false
    }
    const response = await todoAPI.addTodo(todo)
    return response
  }
)

export const patchTodoAsync = createAsyncThunk(
  'todo/patchTodo',
  async (todo : Todo) => {
    const response = await todoAPI.patchTodo(todo)
    return {
      id: todo.id,
      response
    }
  }
)

export const deleteTodoAsync = createAsyncThunk(
  'todo/deleteTodo',
  async (todoId : number) => {
    const response = await todoAPI.deleteTodo(todoId)
    return {
      id: todoId,
      response
    }
  }
)

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        let size = MAX_TODO_LIST > action.payload.length ? action.payload.length : MAX_TODO_LIST
        state.todos = action.payload.slice(0, size)
      })
      .addCase(fetchTodosAsync.rejected, (state) => {
        state.status = 'failed'
      })
    builder
      .addCase(addTodoAsync.pending, (state) => {
        state.addTodoStatus = 'loading'
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.addTodoStatus = 'idle'
        if(state.todos === null) {
          state.todos = [action.payload]
        } else {
          state.todos.push(action.payload)
        }
      })
    builder
      .addCase(patchTodoAsync.pending, (state) => {
        state.patchTodoStatus = 'loading'
      })
      .addCase(patchTodoAsync.fulfilled, (state, action) => {
        state.patchTodoStatus = 'idle'
        let id = action.payload.id
        let found = state.todos !== null ? state.todos.findIndex(todo => todo.id === id) : -1
        if (state.todos && found !== undefined && found > -1) {
          state.todos[found] = {
            ...state.todos[found],
            ...action.payload.response
          }
        }
      })
      .addCase(patchTodoAsync.rejected, (state) => {
        state.patchTodoStatus = 'failed'
      })
    builder
      .addCase(deleteTodoAsync.pending, (state) => {
        state.deleteTodoStatus = 'loading'
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.deleteTodoStatus = 'idle'
        let id = action.payload.id
        let found = state.todos !== null ? state.todos.findIndex(todo => todo.id === id) : -1
        if (state.todos && found !== undefined && found > -1) {
          state.todos.splice(found, 1)
        }
      })
      .addCase(deleteTodoAsync.rejected, (state) => {
        state.deleteTodoStatus = 'failed'
      })
  },
})

export const selectTodos = (state: RootState) => state.todo.todos
export const selectFetchTodoStatus = (state: RootState) => state.todo.status
export const selectAddTodoStatus = (state: RootState) => state.todo.addTodoStatus
export const selectPatchTodoStatus = (state: RootState) => state.todo.patchTodoStatus
export const selectDeleteTodoStatus = (state: RootState) => state.todo.deleteTodoStatus

export default todoSlice.reducer
