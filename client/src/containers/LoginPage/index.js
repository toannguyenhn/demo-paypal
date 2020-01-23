import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { LoginPageWrapper } from './styles'
import { actions } from '../App/slice'
import { withRouter } from 'react-router-dom'

function LoginPage({ dispatchCreateUser, history }) {
  const [name, setName] = useState('')

  const onChangeName = useCallback((e) => {
    setName(e.target.value)
  })

  const createUser = useCallback(() => {
    dispatchCreateUser({name })
    history.push('/')
  })

  return (
    <LoginPageWrapper>
      <div className="login-form">
        <div className="text-center mb-4">
          <h2>Welcome back!</h2>
          <h5>We're so excited to see you again!</h5>
        </div>
        {/* <label className="login-label">Email</label>
        <input className="input mb-2" />
        <label className="login-label">Password</label>
        <input className="input mb-4" /> */}
        <label className="login-label">Name</label>
        <input className="input mb-4" value={name} onChange={onChangeName} />
        <button className="btn primary block" onClick={createUser}>Login</button>
      </div>
    </LoginPageWrapper>
  )
}

export default withRouter(connect(
  // state => ({ user: state.app.user, fullname: selectUsername(state) }),
  null,
  { dispatchCreateUser: actions.dispatchCreateUser },
)(LoginPage))
