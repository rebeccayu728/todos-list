import { Todo } from './todoReducer'

export function fetchTodos(userId : number = 1) {
  return fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
    .then(response => response.json())
    .then(json => {
      return json
    })
}

export function addTodo(todo : Todo) {
  return fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return json
    })
}

export function patchTodo(todo : Todo) {
  return fetch(`https://jsonplaceholder.typicode.com/posts/${todo.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: todo.title,
      completed: todo.completed,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return json
    })
}

export function deleteTodo(todoId : number) {
  return fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'DELETE',
  })
}