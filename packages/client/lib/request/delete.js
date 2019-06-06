const createClient = require('./create-client')

module.exports = deleteResource

/**
 * Delete an HTTP resource.
 *
 * @param {string} target
 * @param {object} [options]
 * @returns {Promise}
 *
 */
async function deleteResource(target, options) {
	const client = createClient()
	let response
	switch (typeof target) {
		case 'string':
			response = client.delete(target, options)
			break
		case 'object':
			response = client.delete(target.target, target.options)
			break
		default:
			throw new Error('target must be string')
	}

	return response
}
