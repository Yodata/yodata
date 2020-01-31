const chalk = require('chalk')
const jsonStringify = require('json-stringify-safe')
const yaml = require('./yaml')
const { toTable } = require('./table')

module.exports = formatResponse

function formatResponse (options, value) {
  if (arguments.length === 1) {
    return value => formatResponse(options, value)
  }

  const { output, color } = options
  switch (output) {
    case 'json':
      return (typeof value === 'string') ? value : jsonStringify(value, null, 2)

    case 'yaml':
      return (typeof value === 'string') ? value : yaml.stringify(value)

    case 'table': {
      try {
        return toTable(options, value)
      } catch (error) {
        // @ts-ignore
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
