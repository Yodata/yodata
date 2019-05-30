const put = require('./put')

module.exports = putData

/**
 * Http PUT to target with body as content-type:application/json
 *
 * @param {string} target - uri of resource to be updated
 * @param {object} [object] - new data
 * @returns {Promise<*>|function}
 */
function putData(target, object) {
	if (arguments.length === 1) {
		return body => put(target, { json: true, body })
	}

	return put(target, { json: true, body: object })
}
