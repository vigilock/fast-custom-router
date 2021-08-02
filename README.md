[![release version](https://img.shields.io/github/v/release/vigilock/fast-custom-router.svg)](https://www.npmjs.com/package/fast-custom-router)
![downloads](https://img.shields.io/npm/dm/fast-custom-router)
[![Jest - Unit tests](https://github.com/vigilock/fast-custom-router/actions/workflows/jest.yml/badge.svg)](https://github.com/vigilock/fast-custom-router/actions/workflows/jest.yml)
[![Node.js Package](https://github.com/vigilock/fast-custom-router/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/vigilock/fast-custom-router/actions/workflows/npm-publish.yml)

```javascript
import { Parser } from 'fast-custom-router'

const parser = new Parser(app, config)
parser.parseFromFile('config.yml')
parser.load()
```

# fast-custom-router

This is a powerful custom enrober for express router.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/) v14.X.X or higher.

Installation is done using the [npm install command](https://docs.npmjs.com/downloading-and-installing-packages-locally):

```bash
npm install fast-custom-router
```

## Features

- strict configuration parser
- dynamic module imports (middlewares and controllers)
- type checking (uri params and body params)
- modular configuration files (with imports)

## Quick start

First of all, you will need to use a router such as [Express](https://expressjs.com/).

Then create one configuration file, for example:

```yaml
# config/config.yaml

api:
  root: /api
  pre_middlewares:
    - authenticate
  post_middlewares:
    - errorHandler
  routes:
    user:
      path: /user/:id
      params:
        id: number
      methods:
        GET:
          controller: user/user:getUser
        DELETE:
          controller: user/deleteUser
          pre_middlewares:
            - checkUserPermissions
          post_middlewares:
            - logRequests
```

Then your main script launcher:

```javascript
// main.js

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import http from 'http'
import Express from 'express'

import { Parser as APIParser } from 'fast-custom-router'

/** Configuration */
const __dirname = dirname(fileURLToPath(import.meta.url))
const config = {
  config_dir: join(__dirname, 'config'),
  controller_dir: join(__dirname, 'controller'),
  middleware_dir: join(__dirname, 'middleware'),
}

/** Define servers */
const app = Express()
const server = http.createServer(app)
const parser = new APIParser(app, config)

parser.parseFromFile('config.yaml')
parser.load()

server.listen(8000, () => {
  console.log('[SERVER][INFO] Server started on port 8000')
})
```

And finnaly create middlewares and controllers

```javascript
// middleware/authenticate.js
export default function authenticate(req, res, next) {
  // Doing stuff here
  next()
}

// [...]

// controller/user.js
export function getUser({params}) {
  return {
    message: `User #${params.id} has been requested !`
  }
}

// controller/deleteUser.js
export default function deleteUser({params}) {
  return {
    message: `User #${params.id} has been deleted !`
  }
}
```

## Documentation

- [Parser](./docs/PARSER.md)
- [Configuration](./docs/CONFIGURATION.md)
- [Controller](./docs/CONTROLLER.md)
- [Middleware](./docs/MIDDLEWARE.md)

## Philosophy

The package philosophy is to provide small a smart configuration parser that load an application into a router. The package must be robust, fast (in execution time way), and fast (in writting code way).

The key words are :

- robust
- modularity
- easy-to-use
- light

It does not depends on any specific router, but we recommand to use with [Express](https://expressjs.com/).

## Tests

The library provide tests, and every commit is checked by using Github Actions : [![Jest - Unit tests](https://github.com/vigilock/fast-custom-router/actions/workflows/jest.yml/badge.svg)](https://github.com/vigilock/fast-custom-router/actions/workflows/jest.yml).

If you want to run the tests by yourself, please follow this commands :

```bash
git clone git@github.com:vigilock/fast-custom-router.git
cd fast-custom-router
npm install
npm test
```

## License

At [Consignity](https://consignity.fr/) we chosen the [MIT License](./LICENSE) as open-sourced license.
