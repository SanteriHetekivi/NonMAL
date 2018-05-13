
import React, { Component } from 'react'
import MangaService from './MangaService'
import InputField from './InputField'
import { withAlert } from 'react-alert'
import PropTypes from 'prop-types'

class Login extends Component {
  constructor (props) {
    super(props)
    // set the initial state
    this.state = {
      username: '',
      password: ''
    }
    this.login = this.login.bind(this)
    this.handleChangeEvent = this.handleChangeEvent.bind(this)
    this.loginSuccess = this.loginSuccess.bind(this)
    this.loginFailure = this.loginFailure.bind(this)
    this.mangaService = new MangaService(props.getToken())
  }

  login (event) {
    event.preventDefault()
    this.mangaService.login(this.state.username, this.state.password,
      this.loginSuccess,
      this.loginFailure
    )
  }

  loginSuccess (_token) {
    this.props.alert.success('Logged-in!')
    this.setState({ username: '', password: '' })
    this.props.setToken(_token)
  }

  loginFailure (err) {
    this.props.alert.error('Login failed!')
    console.log(err)
  }

  handleChangeEvent (event) {
    event.preventDefault()
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>Login</div>
        <div className='panel-body'>
          <InputField
            title='Username'
            type='text'
            name='username'
            value={this.state.username}
            onChange={this.handleChangeEvent}
          />
          <InputField
            title='Password'
            type='password'
            name='password'
            value={this.state.password}
            onChange={this.handleChangeEvent}
          />
        </div>
        <div className='panel-footer'>
          <button type='submit' className='btn btn-primary' onClick={this.login}>Login</button>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  getToken: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  alert: PropTypes.object.isRequired
}

export default withAlert(Login)
