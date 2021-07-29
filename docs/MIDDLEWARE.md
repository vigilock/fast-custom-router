# Middleware

Middlewares are called by router on route request.

## Parameters

Middleware functions receive only one parameter object wich contains:

- **query**: list of uri parameters (type checked)
- **body**: list of body request parameters (type checked)

## Example

```javascript
import db from './database.js'
import User from './User.js'

export default async function authenticate(req, res, next) {
  const user = await db.query(User, req.body.access_token)
  if (user.hasPermission()) {
    next()
  } else {
    next({
      code: 403,
      detail: 'Unauthorized access',
    })
  }
}
```
