import React, { useState, useEffect, useRef } from 'react'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import * as TodoReducer from './todoReducer'
import { Card, Form, FloatingLabel, ListGroup, ButtonGroup, Button, CloseButton } from 'react-bootstrap'
import styles from './Todo.module.css'

interface Props {
  userId ?: number
}


export const TodoList : React.FC<Props> = ({ userId }) => {
  const todos = useAppSelector(TodoReducer.selectTodos)
  const fetchTodoStatus = useAppSelector(TodoReducer.selectFetchTodoStatus)
  const addTodoStatus = useAppSelector(TodoReducer.selectAddTodoStatus)
  const patchTodoStatus = useAppSelector(TodoReducer.selectPatchTodoStatus)
  const deleteTodoStatus = useAppSelector(TodoReducer.selectDeleteTodoStatus)
  const dispatch = useAppDispatch()

  const inputRef = useRef<HTMLInputElement>(null)
  const helpRef = useRef<HTMLSpanElement>(null)

  const [clicked, setIsClicked] = useState(false)
  const [messageType, setMessageType] = useState('muted')
  const [message, setMessage] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'active'>('all')
  const [filteredTodos, setFilteredTodos] = useState<Array<TodoReducer.Todo> | null>(null)


  useEffect(() => {
    dispatch(TodoReducer.fetchTodosAsync(userId))
  }, [userId])
  useEffect(() => {
    if (todos !== null) {
      switch (filterType) {
        case 'all':
          return setFilteredTodos(todos)
        case 'completed':
          return setFilteredTodos(todos.filter(todo => todo.completed === true))
        case 'active':
          return setFilteredTodos(todos.filter(todo => todo.completed !== true))
      
        default:
          return
      }
    }
  }, [filterType, todos])
  useEffect(() => {
    if (fetchTodoStatus === 'failed') {
      setMessageType('danger')
      setMessage('We ran into some issues when fetching your todo list.')
    }
  }, [fetchTodoStatus])
  useEffect(() => {
    if (addTodoStatus === 'idle') {
      setIsClicked(false)
    }
    if (addTodoStatus === 'failed') {
      setMessageType('danger')
      setMessage('There was an issue when adding the new to do.')
    }
  }, [addTodoStatus])
  useEffect(() => {
    if (patchTodoStatus === 'idle' || patchTodoStatus === 'loading') {
      setMessageType('mute')
      setMessage('')
    }
    if (patchTodoStatus === 'failed') {
      setMessageType('danger')
      setMessage('There was an issue when updating the to do.')
    }
  }, [patchTodoStatus])
  useEffect(() => {
    if (deleteTodoStatus === 'idle' || deleteTodoStatus === 'loading') {
      setMessageType('mute')
      setMessage('')
    }
    if (deleteTodoStatus === 'failed') {
      setMessageType('danger')
      setMessage('There was an issue when deleting the to do.')
    }
  }, [deleteTodoStatus])

  function onTextChange (event : React.ChangeEvent<HTMLInputElement>) {
    if (inputRef.current && inputRef.current.value.length > 0) {
      setIsClicked(false)
      setMessageType('muted')
      setMessage('')
    }
  }
  function onAddTodo (event : React.MouseEvent<HTMLInputElement, MouseEvent>) {
    setIsClicked(!clicked)
    if (inputRef.current && inputRef.current.value.length > 0) {
      dispatch(TodoReducer.addTodoAsync(inputRef.current.value))
    } else {
      setMessageType('danger')
      setMessage('Make sure to type a to do before pressing add.')
    }
  }
  function onToggleCompleteTodo (event : React.ChangeEvent<HTMLInputElement>, todo : TodoReducer.Todo) {
    let newtodo = {
      ...todo,
      completed: !todo.completed
    }
    dispatch(TodoReducer.patchTodoAsync(newtodo))
  }
  function onDeleteTodo (event : React.MouseEvent<HTMLButtonElement, MouseEvent>, todoId : number) {
    dispatch(TodoReducer.deleteTodoAsync(todoId))
  }

  function onChangeFilterType(filterType : 'all' | 'completed' | 'active') {
    setFilterType(filterType)
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Todo list</Card.Title>
        <ButtonGroup className="mb-3" aria-label="Basic example">
          <Button variant="outline-secondary" active={filterType === 'all'} onClick={() => onChangeFilterType('all')}>All</Button>
          <Button variant="outline-secondary" active={filterType === 'completed'} onClick={() => onChangeFilterType('completed')}>Completed</Button>
          <Button variant="outline-secondary" active={filterType === 'active'} onClick={() => onChangeFilterType('active')}>Active</Button>
        </ButtonGroup>
        <div className="mb-3">
          <Form.Text ref={helpRef} className={`text-${messageType}`}>
            {message}
          </Form.Text>
        </div>
        <Form>
          <div className="d-flex">
            <FloatingLabel className="mb-3 col" controlId="floatingInput" label="Any new things to do?">
              <Form.Control ref={inputRef} type="text" placeholder="Add something new to do..." onChange={onTextChange}/>
            </FloatingLabel>
            <Button onClick={onAddTodo} className="mb-3" variant="primary" disabled={clicked}>Add</Button>
          </div>
        </Form>
        <Form>
          <ListGroup className="d-flex" variant="flush">
            {
              filteredTodos !== null && filteredTodos.map(function(todo, i){
                return (
                  <ListGroup.Item className={`d-flex justify-content-between align-items-center ${styles.todoItem} ${todo.completed ? styles.completed : ''}`} key={i}>
                    <Form.Check
                      type="checkbox"
                      id={`default-checkbox-${i}`}
                      label={todo.title}
                      checked={todo.completed}
                      onChange={(e) => onToggleCompleteTodo(e, todo)}
                    />
                    <CloseButton onClick={(e) => onDeleteTodo(e, todo.id)} className="text-danger" aria-label="Delete" />
                  </ListGroup.Item>
                )
              })
            }
          </ListGroup>
        </Form>
      </Card.Body>
    </Card>
  )
}
