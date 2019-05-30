const logger = require('@yodata/logger')
const assert = require('assert-plus')
const createClient = require('./create-client')

module.exports = get

/**
 * Fetch an HTTP resource.
 *
 * @param {string} target
 * @param {object} [options]
 * @returns {Promise}
 *
 */
async function get(target, options) {
	if (typeof target === 'object') {
		target = target.target
		options = options || target.options
	}

	assert.string(target, 'request.get.target')
	return createClient().get(target, options).catch(logError)
}

function logError(error) {
	logger.error(error)
	throw new Error(`request.get.failed:${error.message}`)
}
