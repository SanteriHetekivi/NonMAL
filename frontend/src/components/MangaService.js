import axios from 'axios'
import config from './../config'

const URL = config.BACKEND_URL + ':' + config.BACKEND_PORT + '/'

export default class MangaService {
  constructor (_token) {
    this.options = {}
    this.options.headers = {
      Authorization: 'Bearer ' + _token
    }
  }

  login (username, password, success, failure) {
    axios.post(
      URL + 'login',
      {
        'username': username,
        'password': password
      }
    )
      .then(
        (response) => {
          if (response.status === 200) {
            success(response.data.token)
          } else {
            failure(response)
          }
        }
      )
      .catch(failure)
  }

  addUpdate (manga, success, failure) {
    axios.put(URL + 'manga/', manga, this.options)
      .then(
        (response) => {
          if (response.status === 201) {
            success(response.data)
          } else {
            console.log(response)
            failure(response)
          }
        }
      )
      .catch(failure)
  }

  search (name, success, failure) {
    if (name.length > 0) {
      axios.get(URL + 'search/' + name, this.options)
        .then((response) => {
          if (response.status === 200) {
            success(response.data)
          } else {
            failure(response)
          }
        })
        .catch(function (error) {
          console.log(error)
          failure(error)
        })
    } else {
      success([])
    }
  }

  updateMangaList (success, failure) {
    axios.get(URL + 'saveList/', this.options)
      .then(success)
      .catch(failure)
  }
}
