const EMPTY_TYPE = ''

export class Type {
  static Is (_variable, _type) {
    if (!Var.IsSet(_type)) {
      _type = EMPTY_TYPE
    }

    return (Type.Get(_variable) === _type)
  }

  static Get (_variable) {
    if (!Var.IsSet(_variable)) {
      return EMPTY_TYPE
    }

    return Object.getPrototypeOf(_variable).constructor.name
  }

  static Same (_variable1, _variable2) {
    return Type.Is(_variable1, Type.Get(_variable2))
  }

  static IsNumeric (_variable) {
    return (
      Var.IsSet(_variable) &&
      !isNaN(
        parseFloat(_variable)
      ) &&
      isFinite(_variable)
    )
  }
}

export class Var {
  static IsSet (_variable) {
    return (_variable != null)
  }

  static KeyIsSet (_obj, _key) {
    if (_key in _obj) {
      return Var.IsSet(_obj[_key])
    } else {
      return false
    }
  }
}

export class Obj {
  static Clone (_obj) {
    return JSON.parse(JSON.stringify(_obj))
  };
}
