const http = require('./http')
const YAML = require('./util/yaml')

/**
 *
 * @typedef YodataClientResponse
 * @property {string} method - http method (GET/POST/PUT/DELETE)
 * @property {string} url - request url
 * @property {number} statusCode - response code (i.e. 200)
 * @property {string} statusMessage - response status (i.e. OK)
 * @property {object} headers - response headers
 * @property {string} contentType - response contentType
 * @property {string} [body] - message body
 * @property {object} [data] - parsed body (if response is json or yaml)
 */

module.exports = class Client {
	constructor(options = {}) {
		this.podurl = options.podurl || process.env.YODATA_POD_URL
		this.podsecret = options.podsecret || process.env.YODATA_POD_SECRET
		this.http = http(this.podurl, this.podsecret)
	}

	/**
	 * Get resource from target
	 * @param {string} target - resource to fetch i.e. /container/{id}
	 * @returns {Promise<YodataClientResponse>} HTTP response
	 */
	async get(target) {
		return this.http.get(target)
	}

	/**
	 * Write data to target with contentType header
	 * @param {string} target - request path/url
	 * @param {string|object} data - content to write
	 * @param {string} [contentType] - the mime-type to be used
	 */
	async put(target, data, contentType = 'application/json') {
		let body
		const headers = {
			'Content-Type': contentType
		}

		if (typeof data !== 'string') {
			if (contentType.includes('json')) {
				body = JSON.stringify(data, null, 1)
				headers['Content-Type'] = 'applicastion/json'
			} else if (contentType.includes('yaml')) {
				body = YAML.stringify(data)
				headers['Content-Type'] = 'applicastion/x-yaml'
			}
		}

		return this.http.put(target, { body, headers })
	}

	/**
	 * POST data to target with contentType header
	 * @param {string} target - request path/url
	 * @param {string|object} data - content to write
	 * @param {string} [contentType] - the mime-type to be used
	 */
	async post(target, data, contentType = 'application/json') {
		let body
		const headers = {
			'Content-Type': contentType
		}

		if (typeof data !== 'string') {
			if (contentType.includes('json')) {
				body = JSON.stringify(data, null, 1)
				headers['Content-Type'] = 'application/json'
			} else if (contentType.includes('yaml')) {
				body = YAML.stringify(data)
				headers['Content-Type'] = 'application/x-yaml'
			}
		}

		return this.http.post(target, { body, headers })
	}

	/**
	 * Delete resource from target
	 * @param {string} target - resource to fetch i.e. /container/{id}
	 * @returns {Promise<YodataClientResponse>} HTTP response
	 */
	async delete(target) {
		return this.http.delete(target)
	}
}
