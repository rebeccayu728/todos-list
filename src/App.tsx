import React from 'react'

import { useAppSelector } from './app/hooks'
import { selectCurrentUserId } from './components/user/userReducer'

import { TodoList } from './components/todo/TodoList'
import { UserDropdown } from './components/user/UserDropdown'
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

interface Props {

}

const App : React.FC<Props> = () => {
  const currentUserId = useAppSelector(selectCurrentUserId)

  return (
    <div className="App">
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={9}>
            <UserDropdown />
            <TodoList userId={currentUserId} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App
