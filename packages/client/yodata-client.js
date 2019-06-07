const request = require('./http')
const YAML = require('./util/yaml')
const returnKey = require('./util/return-key')
const setObjectValue = require('./util/set-object-value')
const uri = require('./util/uri')

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
	/**
	 * Creates an instance of Client.
	 * @param {object} [options={}] - configuration
	 * @param {string} [options.name] - pod friendly name
	 * @param {string} [options.hostname] - base url of the client pod
	 * @param {string} [options.hostkey] - pod key (x-api-key)
	 */
	constructor(options = {}) {
		this.name = options.name || ''
		this.hostname = options.hostname || process.env.YODATA_POD_URL
		this.hostkey = options.hostkey || process.env.YODATA_POD_SECRET
		this.http = request(this)
	}

	use(fn) {
		fn(this)
		return this
	}

	resolve(path) {
		return uri.resolve(path, this.hostname)
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
	 * @param {string|object} [data] - content to write
	 * @returns {Promise<YodataClientResponse>|function} HTTP response
	 */
	put(target, data) {
		if (arguments.length === 1) {
			return async data => this.put(target, data)
		}

		let body = data
		let contentType

		if (typeof data === 'object') {
			if (target.includes('json')) {
				body = YAML.stringify(data)
				contentType = 'application/x-yaml'
			} else {
				body = JSON.stringify(data, null, 1)
				contentType = 'application/json'
			}
		}

		return this.http.put(target, { body, headers: { 'Content-Type': contentType } })
	}

	/**
	 * POST data to target with contentType header
	 * @param {string} target - request path/url
	 * @param {string|object} [data] - content to write
	 * @returns {Promise<YodataClientResponse>|function} HTTP response
	 */
	post(target, data) {
		if (arguments.length === 1) {
			return async data => this.post(target, data)
		}

		let body = data
		let contentType

		if (typeof data === 'object') {
			if (target.includes('yaml')) {
				body = YAML.stringify(data)
				contentType = 'application/x-yaml'
			} else {
				body = JSON.stringify(data, null, 1)
				contentType = 'application/json'
			}
		}
		console.log({ target, body, contentType })
		return this.http.post(target, { body, headers: { 'Content-Type': contentType } })
	}

	/**
	 * Delete resource from target
	 * @param {string} target - resource to fetch i.e. /container/{id}
	 * @returns {Promise<YodataClientResponse>} HTTP response
	 */
	async delete(target) {
		return this.http.delete(target)
	}

	/**
	 * Fetch, parse and query keys on a json or yaml resource.
	 *
	 * @param {string} target - path (from the current profile.pod.orgin) or fully qualified href
	 * @param {string|string[]} [key] - data key to return
	 * @param {*} [defaultValue] - value to return if data[key] is null/undefined
	 * @returns {Promise<YodataClientResponse>} HTTP response
	 */
	async data(target, key = 'data', defaultValue) {
		return this.get(target)
			.then(returnKey(key, defaultValue))
			.catch(error => {
				if (defaultValue) {
					console.error(error.message)
					return defaultValue
				}

				throw new Error(error.message)
			})
	}

	/**
	 * Set a key/value on a data resource
	 *
	 * @param {string} target - resource to update
	 * @param {string} key - data key to update
	 * @param {*} value - the value to update with
	 * @returns {Promise<YodataClientResponse>} HTTP response
	 */
	async set(target, key, value) {
		const currentValue = await this.data(target, 'data', {})
		const nextValue = setObjectValue(key, value, currentValue)

		return this.put(target, nextValue)
	}
}
