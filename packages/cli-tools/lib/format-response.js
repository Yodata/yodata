const chalk = require('chalk')
const jsonStringify = require('json-stringify-safe')
const yaml = require('./yaml')
const { toTable } = require('./table')

const DEFAULT_OUTPUT_FORMAT = 'text'
const DEFAULT_COLOR = 'green'

module.exports = formatResponse

/**
 * format output for cli/stdout
 * @param {object}} options
 * @param {string} options.output  - text|table|yaml|json
 * @param {string} [options.color] - any chalk valid color
 * @param {string|object} value - the content to be printed
 * @returns mill
 */
function formatResponse (options, value) {
  if (arguments.length === 1) {
    return value => formatResponse(options, value)
  }
  const { output = DEFAULT_OUTPUT_FORMAT, color = DEFAULT_COLOR } = options
  switch (output) {
    case 'json':
      return (typeof value === 'string') ? value : jsonStringify(value, null, 2)

    case 'yaml':
      return (typeof value === 'string') ? value : yaml.stringify(value)

    case 'table': {
      try {
        const result = toTable(options, value)
        return result
      } catch (error) {
        // @ts-ignore
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
