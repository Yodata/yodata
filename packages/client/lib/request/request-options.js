const defaults = require('lodash/defaultsDeep')
const parseResponse = require('../http/parse-response')
const logRequest = require('../http/log-request')

module.exports = getConfig
/**
 * Get client options from currentProfile or default
 *
 * @param {object} [options]
 * @param {string} [options.baseUrl]
 * @param {object} [options.headers]
 * @returns {object}
 */
function getConfig(options) {
	const profileOptions = {
		baseUrl: options.baseUrl || process.env.YODATA_POD_URL,
		headers: {
			'user-agent': 'yodata/client (https://yodata.io)',
			'x-api-key': process.env.YODATA_POD_SECRET
		},
		hooks: {
			beforeRequest: [
				logRequest
			],
			afterResponse: [
				parseResponse
			]
		}
	}
	return defaults(options, profileOptions)
}
