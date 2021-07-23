import InvalidArgument from '../errors/InvalidArgument'

export default class Middleware {
  constructor(name) {
    if (!(name instanceof String)) {
      throw new InvalidArgument(`Middleware.name="${this.name}" must be a String.`)
    }

    this.name = name

    console.log(this.name)
  }

  toString() {
    return `<Middleware name="${this.name}">`
  }
}
