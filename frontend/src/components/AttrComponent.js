
import { Component } from 'react'
import { Var } from '../Tools'

export default class AttrComponent extends Component {
  attr (_name) {
    if (Var.KeyIsSet(this.props, _name)) {
      return this.props[_name]
    } else {
      return null
    }
  }
}
