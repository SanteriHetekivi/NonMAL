import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class MangaListRow extends Component {
  constructor (props) {
    super(props)
    this.manga = this.props.obj
    this.handleOnClick = this.handleOnClick.bind(this)
    if (!(this.manga.volumes > 0)) {
      this.manga.volumes = '?'
    }
    if (!(this.manga.chapters > 0)) {
      this.manga.chapters = '?'
    }
  }

  handleOnClick () {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.manga)
    }
  }

  render () {
    return (
      <tr onClick={this.handleOnClick}>
        <td>
          <img src={this.manga.image} alt='Manga' /><br />
          Title: {this.manga.title}<br />
          Volumes: {this.manga.volume}/{this.manga.volumes}<br />
          Chapters: {this.manga.chapter}/{this.manga.chapters}<br />
          Status: {this.manga.status}<br />
          Score: {this.manga.score}<br />
        </td>
      </tr>
    )
  }
}

MangaListRow.propTypes = {
  onClick: PropTypes.func.isRequired,
  obj: PropTypes.object.isRequired
}
