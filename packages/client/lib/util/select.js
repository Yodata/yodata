const pick = require('lodash/pick')
const kindOf = require('kind-of')

/**
 * Select object key(s)
 *
 * @param {string|string[]} selector
 * @param {object} [data]
 * @returns {object|object[]} object containing the selected keys only
 */
function select(selector, data) {
	if (arguments.length === 1) {
		return value => select(selector, value)
	}

	switch (kindOf(data)) {
		case 'array':
			return data.map(select(selector))
		case 'object':
			return pick(data, selector)
		default:
			return data
	}
}

module.exports = select
