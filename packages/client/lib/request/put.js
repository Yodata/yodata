const assert = require('assert-plus')
const createClient = require('./create-client')

module.exports = put

/**
 * Http push request.
 *
 * @param {string} target - href to target resource
 * @param {object} [options] - client request options
 * @returns {Promise<*>} - http response
 */
async function put(target, options) {
	assert.string(target, 'request.put.target')
	assert.optionalObject(options, 'request.put.options')
	return createClient().put(target, options)
}
