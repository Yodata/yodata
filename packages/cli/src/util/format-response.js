const chalk = require('chalk')
const jsonStringify = require('json-stringify-safe')
const yaml = require('./yaml')
const { toTable } = require('./table')
const logger = require('./logger')

module.exports = formatResponse

function formatResponse (options, value) {
  if (arguments.length === 1) {
    return value => formatResponse(options, value)
  }

  const { output, color } = options
  switch (output) {
    case 'json':
      return jsonStringify(value, null, 2)

    case 'yaml':
      return yaml.stringify(value)

    case 'table': {
      try {
        const result = toTable(options, value)
        return result
      } catch (error) {
        console.error(chalk.red(error.message), '\n')
        return value
      }
    }

    case 'text':
      return applyColor({ color }, value)
    default:
      return applyColor({ color }, value)
  }
}

function applyColor (options, value) {
  if (arguments.length === 1) {
    return value => applyColor(options, value)
  }

  const { color } = options
  return color ? chalk[color](value) : value
}
