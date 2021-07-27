/**
 * Basic middleware for tests.
 *
 * @param {Express.Request} req Request
 * @param {Express.Request} res Response
 * @param {Express.RequestHandler} next Next function
 */
export default function middleware(req, res, next) {
  next()
}
