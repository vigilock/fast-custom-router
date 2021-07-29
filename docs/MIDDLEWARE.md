# Middleware

Middlewares are called by router on route request.

## Parameters

Middleware functions receive arguments as Express router.

Cf. [Express documentation](https://expressjs.com/en/guide/writing-middleware.html)

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
