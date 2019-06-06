const got = require('got')
const logRequest = require('./log-request')
const parseRespose = require('./parse-response')

module.exports = createHTTPClient

/**
 * Returns an http client with defaults configured.
 *
 * @param {string} url - base url i.e. http://example.com
 * @param {string} secret - pod authetication secret (x-api-key)
 * @returns {object} http client
 */

function createHTTPClient(url, secret) {
	return got.extend(
		{
			baseUrl: url,
			headers: {
				'user-agent': 'yodata/client (https://yodata.io)',
				'x-api-key': secret
			},
			hooks: {
				beforeRequest: [
					logRequest
				],
				afterResponse: [
					parseRespose
				]
			}
		}
	)
}
