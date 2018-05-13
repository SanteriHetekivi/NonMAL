
import React from 'react'
import AttrComponent from './AttrComponent'
import Input from './Input'
import Title from './Title'

export default class InputField extends AttrComponent {
  render () {
    return (
      <div>
        <Title {...this.props} />
        <Input {...this.props} />
      </div>
    )
  }
}
