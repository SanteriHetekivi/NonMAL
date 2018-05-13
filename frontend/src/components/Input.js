
import React from 'react'
import { Type } from '../Tools'
import AttrComponent from './AttrComponent'
import Select from 'react-select'

export default class Input extends AttrComponent {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  id (_skipCompare = false) {
    var value = this.attr('id')
    if (!_skipCompare && value === null) {
      value = this.name(true)
    }
    return value
  }

  name (_skipCompare = false) {
    var value = this.attr('name')
    if (!_skipCompare && value === null) {
      value = this.id(true)
    }
    return value
  }

  max (_skipCompare = false) {
    var value = this.attr('max')
    if (!Type.IsNumeric(value)) {
      value = null
    } else {
      value = parseFloat(value)
    }
    if (!_skipCompare) {
      var min = this.min(true)
      if (min !== null && min > value) {
        value = null
      }
    }
    return value
  }

  min (_skipCompare = false) {
    var value = this.attr('min')
    if (!Type.IsNumeric(value)) {
      value = null
    } else {
      value = parseFloat(value)
    }
    if (!_skipCompare) {
      var max = this.max(true)
      if (max !== null && value > max) {
        value = null
      }
    }
    return value
  }

  value () {
    var value = this.attr('value')
    if (value === null) {
      value = ''
    }
    return value
  }

  type () {
    var value = this.attr('type')
    if (value === null) {
      value = 'text'
    }
    return value
  }

  steps () {
    return this.attr('steps')
  }

  options () {
    var value = this.attr('options')
    if (value === null || !Type.Is(value, 'Array')) {
      value = []
    }
    return value
  }

  onChange (event) {
    const type = this.type()
    if (type !== 'select') {
      event.preventDefault()
      if (event.target.value !== '') {
        var max = this.max()
        if (max !== null && event.target.value > max) {
          event.target.value = max
        }

        var min = this.min()
        if (min !== null && event.target.value < min) {
          event.target.value = min
        }
      }
    }

    var onChange = this.attr('onChange')
    if (Type.Is(onChange, 'Function')) {
      onChange(event)
    }
  }

  onKeyUp () {
    var value = this.attr('onKeyUp')
    if (!Type.Is(value, 'Function')) {
      value = null
    }
    return value
  }

  render () {
    const type = this.type()
    if (type === 'select') {
      return (
        <Select
          id={this.id()}
          name={this.name()}
          value={this.value()}
          onChange={this.onChange}
          options={this.options()}
        />
      )
    } else {
      return (
        <input
          id={this.id()}
          name={this.name()}
          value={this.value()}
          max={this.max()}
          min={this.min()}
          steps={this.steps()}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp()}
          type={type}
          className='form-control'
        />
      )
    }
  }
}
