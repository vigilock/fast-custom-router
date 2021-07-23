export default class EmptyMethods extends Error {
  constructor(name) {
    super()
    this.name = 'No methods provided.'
    this.message = `${name} route does not provide methods.`
  }
}
