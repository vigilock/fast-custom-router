# Controller

Controllers are called by router on route method request.

Controllers can be as well asynchronous functions.

Controller can return objects or none return.

## Parameters

Controller functions receive only one parameter object wich contains:

- **query**: list of uri parameters (type checked)
- **body**: list of body request parameters (type checked)

## Throw exception

You can throw an exception inside a controller.

The exception with be pass to middleware err argument in `next(err, req, res, next)` signature.

## Example

```javascript
import db from './database.js'
import User from './User.js'

export default async function getUsers({ query, body }) {
  const users = await db.queryAll(User)
  return users
}
```
