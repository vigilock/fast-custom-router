export default class FakeResponse {
  constructor() {
    this._statusCode = 0
    this._json = null
  }
  status(code) {
    this._statusCode = code
  }
  json(res) {
    this._json = res
  }
}
