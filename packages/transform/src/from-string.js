const assert = require('assert-plus')
const yaml = require('js-yaml')


/**
 * attempt to parse a string as yaml or json
 *
 * @param {string} value
 * @param {object} [options]
 */
module.exports = function fromString(value, options = { json: true }) {
	assert.string(value)
	return yaml.load(value, options)
}
