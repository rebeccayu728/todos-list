import React, { useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import * as UserReducer from './userReducer'
import { Form, FloatingLabel } from 'react-bootstrap'

interface Props {

}


export const UserDropdown : React.FC<Props> = () => {
  const users = useAppSelector(UserReducer.selectUsers)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(UserReducer.fetchUsersAsync())
  }, [])

  function onUserChange (event: React.FormEvent<HTMLSelectElement>) {
    let newUserId = (event.target as HTMLInputElement).value
    dispatch(UserReducer.changeCurrentUserId(Number(newUserId)))
  }

  return (
    <FloatingLabel className="mb-3" label="Current user">
      <Form.Select aria-label="Select current user" onChange={onUserChange}>
        {
          users !== null && users.map(function(user, i){
            return (
              <option value={user.id} key={i}>{user.name}</option>
            )
          })
        }
      </Form.Select>
    </FloatingLabel>
  )
}
