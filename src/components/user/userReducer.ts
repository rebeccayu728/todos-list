import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import * as userAPI from './userAPI'

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: UserAddress
  phone: string
  website: string
  company: UserCompany
}

export interface UserAddress {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: {
    lat: number
    lng: number
  }
}

export interface UserCompany {
  name: string
  catchPhrase: string
  bs: string
}

export interface UserState {
  users: Array<User> | null
  status: 'idle' | 'loading' | 'failed'
  currentUserId: number
}

const initialState: UserState = {
  users: null,
  status: 'idle',
  currentUserId: 1
}

export const fetchUsersAsync = createAsyncThunk(
  'user/fetchUsers',
  async () => {
    const response = await userAPI.fetchUsers()
    return response
  }
)


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeCurrentUserId: (state, action: PayloadAction<number>) => {
      state.currentUserId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        if(state.users === null) {
          state.users = action.payload
        } else {
          state.users.concat(action.payload)
        }
      })
      .addCase(fetchUsersAsync.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { changeCurrentUserId } = userSlice.actions

export const selectUsers = (state: RootState) => state.user.users
export const selectFetchUserStatus = (state: RootState) => state.user.status
export const selectCurrentUserId = (state: RootState) => state.user.currentUserId

export default userSlice.reducer
