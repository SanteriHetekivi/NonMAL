
import React, { Component } from 'react'
import 'react-select/dist/react-select.css'
import InputField from './InputField'
import { Type } from '../Tools'
import { withAlert } from 'react-alert'
import PropTypes from 'prop-types'

const FIELD_NAMES = {
  id: 'series_mangadb_id'
}

export class Empty {
  static Manga () {
    return {
      _id: '',
      title: '',
      series_mangadb_id: 0,
      volume: 0,
      chapter: 0,
      status: 0,
      score: 0
    }
  }

  static Additional () {
    return {
      chapters: '?',
      volumes: '?'
    }
  }
}

class Manga extends Component {
  constructor (props) {
    super(props)

    this.state = {
      manga: Empty.Manga(),
      additional: Empty.Additional()
    }
    this.mangaService = this.props.mangaService

    this.handleChangeEvent = this.handleChangeEvent.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.statusChanged = this.statusChanged.bind(this)
    this.receivedManga = null
  }

  componentWillReceiveProps (nextProps) {
    if (this.receivedManga !== nextProps.manga) {
      console.log(nextProps)
      this.receivedManga = nextProps.manga
      this.setManga(this.receivedManga)
    }
  }

  handleAdd (event) {
    event.preventDefault()
    this.mangaService.addUpdate(this.state.manga,
      (result) => {
        this.props.alert.success('Manga added/updated!')
        this.clear()
      },
      (err) => {
        console.log(err)
        this.props.alert.error('Manga addition/update failed!')
      }
    )
  }

  handleCancel (event) {
    event.preventDefault()
    this.clear()
  }

  handleChangeEvent (event) {
    event.preventDefault()
    var name = event.target.name
    var value = event.target.value
    this.setManga({ [name]: value })
    if (name === 'title') {
      this.titleChanged(value, true)
    }
  }

  statusChanged (option) {
    var value = 0
    if (option !== null) {
      value = option.value
    }
    this.setManga({ status: value })
  }

  clear () {
    this.setState({ manga: Empty.Manga(), additional: Empty.Additional() })
    if (typeof this.props.updateEvent === 'function') {
      this.props.updateEvent({})
    }
  }

  setManga (data) {
    for (var name in FIELD_NAMES) {
      if (name in data) {
        data[FIELD_NAMES[name]] = data[name]
        delete data[name]
      }
    }
    var manga = this.state.manga
    var additional = this.state.additional
    var emptyManga = Empty.Manga()
    var emptyAdditional = Empty.Additional()
    for (name in data) {
      if (name in emptyManga) {
        manga[name] = data[name]
      }
      if (name in emptyAdditional) {
        additional[name] = data[name]
      }
    }

    if ('status' in manga && !isFinite(manga.status)) {
      delete manga.status
    }

    if (Type.IsNumeric(manga.chapter) && manga.chapter > 0) {
      if (Type.IsNumeric(additional.chapters) && additional.chapters > 0 && manga.chapter >= additional.chapters) {
        manga.status = 2
      } else {
        manga.status = 3
      }
    }

    this.setState({ manga: manga, additional: additional })
  }

  titleChanged (title, fromTimer = false) {
    this.mangaService.search(title,
      (mangas) => {
        if (typeof this.props.updateEvent === 'function') {
          this.props.updateEvent(mangas)
        }
      },
      (error) => {
        console.log(error)
        this.props.alert.error('Search failed!')
      }
    )
  }

  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>Manga</div>
        <div className='panel-body'>
          <input type='hidden' name='_id' value={this.state.manga._id} />
          <input type='hidden' name='series_mangadb_id' value={this.state.manga.series_mangadb_id} />
          <InputField
            title='Title'
            type='text'
            name='title'
            value={this.state.manga.title}
            onChange={this.handleChangeEvent}
          />
          <InputField
            title='Volumes'
            type='number'
            name='volume'
            value={this.state.manga.volume}
            onChange={this.handleChangeEvent}
            min='0'
            max={this.state.additional.volumes}
          />
          <InputField
            title='Chapters'
            type='number'
            name='chapter'
            value={this.state.manga.chapter}
            onChange={this.handleChangeEvent}
            min='0'
            max={this.state.additional.chapters}
          />
          <InputField
            title='Status'
            type='select'
            name='status'
            value={this.state.manga.status}
            onChange={this.statusChanged}
            options={
              [
                { value: 1, label: 'Reading' },
                { value: 2, label: 'Completed' },
                { value: 3, label: 'On-Hold' },
                { value: 4, label: 'Dropped' },
                { value: 6, label: 'Plan To Read' }
              ]
            }
          />
          <InputField
            title='Score'
            type='number'
            name='score'
            value={this.state.manga.score}
            onChange={this.handleChangeEvent}
            min='0'
            max='10'
            steps='1'
          />
        </div>
        <div className='panel-footer'>
          <button type='submit' className='btn btn-primary' onClick={this.handleAdd}>Set</button>
          <button type='button' className='btn btn-default' onClick={this.handleCancel}>Clear</button>
        </div>
      </div>
    )
  }
}

Manga.propTypes = {
  alert: PropTypes.object.isRequired,
  mangaService: PropTypes.object.isRequired,
  manga: PropTypes.object,
  updateEvent: PropTypes.func
}

export default withAlert(Manga)
