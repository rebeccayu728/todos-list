import userReducer, { UserState, changeCurrentUserId } from './userReducer'

describe('user reducer', () => {
  const initialState: UserState = {
    users: [],
    status: 'idle',
    currentUserId: 1
  };
  it('should handle initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual({
      users: null,
      status: 'idle',
      currentUserId: 1
    })
  })
  it('should handle changeCurrentUserId', () => {
    const actual = userReducer(initialState, changeCurrentUserId(2));
    expect(actual.currentUserId).toEqual(2);
  })
})
