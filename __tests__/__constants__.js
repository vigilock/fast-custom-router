import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const config = {
  config_dir: join(__dirname, 'config'),
  controller_dir: join(__dirname, 'controller'),
  middleware_dir: join(__dirname, 'middleware'),
}
