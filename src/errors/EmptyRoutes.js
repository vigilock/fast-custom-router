/** Indicates that a root does not provide routes. */
export default class EmptyRoutes extends Error {
  constructor(name) {
    super()
    this.name = 'No routes provided.'
    this.message = `${name} root does not provide routes.`
  }
}
