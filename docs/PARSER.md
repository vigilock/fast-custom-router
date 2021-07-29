# Parser

The parser check if the given configuration is valid, if not, the parser will throw an explicit exception.

## Configuration

```javascript
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const config = {
  config_dir: join(__dirname, 'config'),
  controller_dir: join(__dirname, 'controller'),
  middleware_dir: join(__dirname, 'middleware'),
}
```

The config object is useful to specify configuration, middleware, controller directories. Please specify absolute path, as shown above.

## Parse configuration

The first step to load a configuration file is parsing it.

There is 3 ways to parse a configuration:

- parse a **yaml file** with `parser.parseFromFile('config.yaml')`
- parse a **yaml string** with `parser.parseFromString('config.yaml')`
- parse an **object file** with `parser.parseConfig('config.yaml')`

## Load configuration

The second step to load is just calling `load` method on parser:

```javascript
parser.load()
```

This methods import dependencies modules (middlewares and controllers), then load configuration into the app (Express if you use it).
