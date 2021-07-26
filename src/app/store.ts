import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import userReducer from '../components/user/userReducer'
import todoReducer from '../components/todo/todoReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
    todo: todoReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
