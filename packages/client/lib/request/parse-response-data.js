const yaml = require('js-yaml')

module.exports = parseResponseData

/**
 *
 * @param {object} response - and http.response
 * @param {object} response.headers
 * @param {string} [response.body]
 * @returns {Promise<object>} reponse with parsed .data property
 */
async function parseResponseData(response) {
	const contentType = String(response.headers['content-type'])
	if (contentType.includes('json')) {
		response.data = JSON.parse(response.body)
	} else if (contentType.includes('yaml')) {
		response.data = yaml.load(response.body)
	}

	return response
}
