
import React, { Component } from 'react'
import MangaService from './MangaService'
import MangaListRow from './MangaListRow'
import Manga, { Empty } from './Manga'
import { withAlert } from 'react-alert'
import PropTypes from 'prop-types'

class MangaList extends Component {
  constructor (props) {
    super(props)
    this.state = { items: '', manga: Empty.Manga() }
    this.mangaService = new MangaService(props.getToken())

    this.setMangas = this.setMangas.bind(this)
    this.onMangaClick = this.onMangaClick.bind(this)
    this.updateMangaList = this.updateMangaList.bind(this)
    this.logout = this.logout.bind(this)

    this.manga = React.createRef()
  }

  setMangas (mangas) {
    this.setState({ items: {} })
    if (mangas !== null) {
      this.setState({ items: mangas })
    }
  }

  tabRow () {
    if (this.state.items instanceof Array) {
      var thisRef = this
      return this.state.items.map(function (object, i) {
        return <MangaListRow onDelete={thisRef.onDelete} onUpdate={thisRef.onUpdate} obj={object} key={i} onClick={thisRef.onMangaClick} />
      })
    }
  }

  onMangaClick (manga) {
    this.setState({ manga: manga })
  }

  updateMangaList (event) {
    event.preventDefault()
    this.mangaService.updateMangaList(
      () => {
        this.props.alert.success('MangaList updated!')
      },
      (err) => {
        this.props.alert.error('Error:' + JSON.stringify(err))
      }
    )
  }

  logout () {
    this.props.alert.success('Logged-out!')
    this.props.setToken('')
  }

  render () {
    return (
      <div className='container'>
        <button onClick={this.logout}>Logout</button>
        <button onClick={this.updateMangaList}>Update MangaList</button>
        <Manga updateEvent={this.setMangas} manga={this.state.manga} mangaService={this.mangaService} />
        <div className='panel panel-default'>
          <div className='panel-heading'>List of Mangas</div>
          <div className='panel-body'>
            <table id='manga-list' className='table table-bordered'>
              <tbody>
                {this.tabRow()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

MangaList.propTypes = {
  getToken: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  alert: PropTypes.object.isRequired
}

export default withAlert(MangaList)
