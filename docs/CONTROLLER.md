# Controller

Controllers are called by router on route method request.

Controllers can be as well asynchronous functions.

Controller can return objects or none return.

## Parameters

Controller functions receive only one parameter object wich contains:

- **query**: list of uri query (type not checked)
- **params**: list of uri parameters (type checked)
- **body**: list of body request parameters (type checked)
- **headers**: correspond to req.headers (cf. Express.Resquest, type not checked)
- **status**: set custom http response code
- others custom arguments (cf. [Middleware#CustomArgs](./MIDDLEWARE.md#pass-custom-arguments-to-controllers))

## Throw exception

You can throw an exception inside a controller.

The exception with be pass to middleware err argument in `next(err, req, res, next)` signature.

## Example

```javascript
import db from './database.js'
import User from './User.js'

export default async function getUsers({ query, params, body, headers, status }) {
  // status(202)
  const users = await db.queryAll(User)
  return users
}
```
