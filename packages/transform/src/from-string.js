const assert = require('assert-plus')
const yaml = require('js-yaml')

module.exports = fromString

/**
 * Attempt to parse a string as yaml or json
 *
 * @param {string} value - the value to parse
 * @param {object} [options] - optionsal js-yaml parserOptions
 */
function fromString(value, options = {json: true}) {
  assert.string(value)
  return yaml.load(value, options)
}
