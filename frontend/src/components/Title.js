
import React from 'react'
import AttrComponent from './AttrComponent'

export default class Title extends AttrComponent {
  for () {
    var value = this.attr('for')
    if (value === null) {
      value = this.attr('id')
    }
    if (value === null) {
      value = this.attr('name')
    }
    return value
  }

  title () {
    return this.attr('title')
  }

  render () {
    return (
      <label
        htmlFor={this.for()}>
        {this.title()}
      </label>
    )
  }
}
