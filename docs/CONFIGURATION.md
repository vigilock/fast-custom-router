# Configuration

First of all, the configuration can be stored in yaml, json, or as javascript object, but in this documentation we use only yaml syntax.

## Type checking

- number
- string
- boolean

## Structures

The following structures are availables :

- [Root](#root)
- [Route](#route)
- [RouteMethod](#routemethod)
- [Import](#import)

When mentionned `pre_middlewares` and `post_middlewares`, it refers to middlewares that are executed before and afters routes.
They are optionnal, and contains name of middlewares:

```yaml
pre_middlewares:
  - myPreMiddleware
post_middlewares:
  - myPostMiddleware
```

### Root

Root represent a root uri that provides `pre_middlewares` and `post_middlewares`.

`root` is the _uri_ root, can be defined as `/`, or `/what-ever-you-want`.

`routes` is a list of [Root](#root), [Routes](#routes), and [Import](#import) configuration.

Example :

```yaml
api:
  root: /api
  pre_middlewares:
    - authenticate
  post_middlewares:
    - errorHandler
  routes:
    subApi:
      root: /sub
      routes:
        [...]
    user:
      path: /user
      [...]
    import:
      - extendedConfiguration.yaml
```

### Route

Route represent a final route uri that provides `pre_middlewares` and `post_middlewares`.

`path` is the _uri_ root, it can be defined as `/`, or `/what-ever-you-want`.
Also _uri_ parameter can be added as : `/user/:id` with id parameter. But you need to type it as shown below.

`query` provides uri parameters typing.

`methods` is a list of [RouteMethod](#routemethod) configuration.

Methods can only be:

- get
- post
- put
- patch
- delete

Example :

```yaml
user:
  path: /user/:id
  query:
    id: number
  pre_middlewares:
    - checkUserPermissions
  post_middlewares:
    - logRequests
  methods:
    GET: [...]
    POST: [...]
    PUT: [...]
    PATCH: [...]
    DELETE: [...]
```

### RouteMethod

RouteMethod represents a route method that can be called, and it provides `pre_middlewares` and `post_middlewares`.

`controller` is the controller path. By default, default export will be loaded, but you can use load named export
by separating path from named export with `:`.

`response_code` is the default HTTP reponse code, optionnal, 200 by default.

`body` provides request body parameters typing with optionnal default value.

Example :

```yaml
# stay simple
GET:
  controller: getUsers

# or with more complex route method
POST:
  controller: subDir/controllerUsers:postUser
  response_code: 201
  body:
    username:
      type: string
    password:
      type: string
    age:
      type: number
      default_value: 20
  post_middlewares:
    - logRequests
```

### Import

Import is import space that allow to split a long configuration file in multiples files. Import configuration at a certain level.

Just list configuration file paths inside import declaration.

Example :

```yaml
import:
  - directory/subConfiguration.yaml
  - anotherSubConfiguration.yaml
```

## Example

There is a configuration example:

```yaml
# main.yaml
api:
  root: /api
  pre_middlewares:
    - authenticate
  post_middlewares:
    - errorHandler
  routes:
    import:
      - usersRoute.yaml
      - userRoute.yaml
static:
  root: /static
  [...]

# usersRoute.yaml
user:
  path: /user/:id
  query:
    id: number
  methods:
    GET:
      controller: user/getUser:getUser
    DELETE:
      controller: user/deleteUser
      pre_middlewares:
        - checkUserPermissions
      post_middlewares:
        - logRequests

# userRoute.yaml
users:
  path: /user
  methods:
    GET:
      controller: getUsers
    POST:
      controller: postUsers
      response_code: 201
      body:
        username:
          type: string
        password:
          type: string
        age:
          type: number
      post_middlewares:
        - logRequests
```
