import todoReducer from './todoReducer'

describe('todo reducer', () => {
  it('should handle initial state', () => {
    expect(todoReducer(undefined, { type: 'unknown' })).toEqual({
      todos: null,
      filter: 'all',
      status: 'idle',
      addTodoStatus: 'idle',
      patchTodoStatus: 'idle',
      deleteTodoStatus: 'idle',
    })
  })
})
