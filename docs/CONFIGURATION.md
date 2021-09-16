# Configuration

First of all, the configuration can be stored in yaml, json, or as javascript object, but in this documentation we use only yaml syntax.

## Type checking

- number
- string
- boolean

## Structures

The following structures are availables :

- [Configuration](#configuration)
  - [Type checking](#type-checking)
  - [Structures](#structures)
    - [Root](#root)
    - [Route](#route)
    - [RouteMethod](#routemethod)
      - [Disable abstraction](#disable-abstraction)
    - [Import](#import)
  - [Example](#example)

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

`params` provides uri parameters typing.

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
  params:
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

`body` provides request body parameters typing with optionnal default value (can be setted to `null` or `undefined`).

Example :

```yaml
# stay simple
GET:
  controller: getUsers

# stay very simple
GET: getUsers

# or with more complex route method
POST:
  controller: subDir/controllerUsers:postUser
  response_code: 201
  body:
    username:
      type: string
    password:
      type: string
    email: mail # Using shortcut
    stayConnected: boolean
    age:
      type: number
      default_value: 20
    weight:
      type: number
      default_value: undefined
      # OR
      default_value: null
```

#### Disable abstraction

By default each controller is decorated by the library.

There is many advantages:

- Write unit tests is easier
- Controllers are less requests dependent
- All parameters are type checked (body, query, and params)
- Can define default response code
- Can throw execptions in controllers
- ...

But in some cases you can't use your code with this decorator,
for example with [Passport.js](https://www.passportjs.org/),
and you have to disable the abtraction:

```yaml
# Decorator will be disabled
GET:
  controller: myPassportController
  abstract: false
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
  params:
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
