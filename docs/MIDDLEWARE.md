# Middleware

Middlewares are called by router on route request.

## Parameters

Middleware functions receive arguments as Express router.

Cf. [Express documentation](https://expressjs.com/en/guide/writing-middleware.html)

## Pass custom arguments to controllers

`req.__fcrm_custom_params` is an object that you can write in it,
and value will be pass to controllers.

For example :

```javascript
// middleware/authenticate.js
export default function authenticate(req, res, next) {
  req.__fcr_custom_params.user = {
    username: 'test',
    isConnected: false,
  }
  next()
}

// controller/getUser.js
export default function getUser({ user }) {
  console.log('Current user : ' + user)
}
```

## Example

```javascript
import db from './database.js'
import User from './User.js'

export default async function authenticate(req, res, next) {
  const user = await db.query(User, req.body.access_token)
  if (user.hasPermission()) {
    req.__fcr_custom_params.user = user
    next()
  } else {
    next({
      code: 403,
      detail: 'Unauthorized access',
    })
  }
}
```
