/**
 * Basic middleware for tests.
 *
 * @param {Request} req Request
 * @param {Request} res Response
 * @param {RequestHandler} next Next function
 */
export default function middleware(req, res, next) {
  next()
}
