const config = require('@yodata/config')
const defaults = require('lodash/defaultsDeep')
const parseResponseData = require('./parse-response-data')

module.exports = getConfig
/**
 * get client options from currentProfile or default
 *
 * @param {object} [options]
 * @param {string} [options.baseurl]
 * @param {object} [options.headers]
 * @returns {object}
 */
function getConfig(options) {
	const profileOptions = {
		baseUrl: get('pod.url'),
		headers: {
			'user-agent': `yodata/client (https://yodata.io)`,
			'x-api-key': get('pod.secret')
		},
		hooks: {
			afterResponse: [
				parseResponseData
			]
		}
	}
	return defaults(options, profileOptions)
}

function get(key, defaultValue) {
	return config.getProfileValue(key) || config.get(`default.${key}`, defaultValue)
}

