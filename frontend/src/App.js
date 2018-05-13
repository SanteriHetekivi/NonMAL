import React, { Component } from 'react'
import './App.css'
import { Header } from './components/Header'
import MangaList from './components/MangaList'
import { Type } from './Tools'
import Login from './components/Login'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: this.checkToken(false, false)
    }
    this.setToken = this.setToken.bind(this)
    this.getToken = this.getToken.bind(this)
  }

  setToken (_token) {
    sessionStorage.setItem('jwtToken', _token)
    this.checkToken(_token)
  }

  checkToken (_token = false, _setState = true) {
    if (_token === false) {
      _token = this.getToken(_setState)
    }
    var loggedIn = (Type.Is(_token, 'String') && _token.length > 0)
    if (_setState) {
      this.setState({ loggedIn: loggedIn })
    }
    return loggedIn
  }

  getToken (_setState = true) {
    const token = sessionStorage.getItem('jwtToken')
    if (this.checkToken(token, _setState)) {
      return token
    } else {
      return null
    }
  }

  mainPage () {
    if (this.state.loggedIn) {
      return (<MangaList setToken={this.setToken} getToken={this.getToken} />)
    } else {
      return (<Login setToken={this.setToken} getToken={this.getToken} />)
    }
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12'>
            <Header />
          </div>
        </div>
        <div>
          <div>
            {this.mainPage()}
          </div>
        </div>
      </div>
    )
  }
}

export default App
