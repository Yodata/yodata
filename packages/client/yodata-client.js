/** @format */

const request = require('./http')
const returnKey = require('./util/return-key')
const assign = require('./util/assign-deep')
const getValue = require('./util/get-object-value')
const setValue = require('./util/set-object-value')
const { URL } = require('url')
const buildOptions = require('./util/build-options')
const uri = require('./util/uri')
const arrayContains = require('./util//array-has-object.js')
const removeFromCollection = require('./util/remove-from-collection')

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
 * @property {function} [then] - promise resolution
 */

class Client {
  /**
   * Creates an instance of Client.
   * @param {object} [options={}] - configuration
   * @param {string} [options.name] - pod friendly name
   * @param {string} [options.hostname] - base url of the client pod
   * @param {string} [options.hostkey] - pod key (x-api-key)
   **/
  constructor (options = {}) {
    this.name = options.name || process.env.YODATA_PROFILE
    this.hostname =
      options.hostname ||
      process.env.SVC_HOST ||
      process.env.SOLID_HOST ||
      process.env.YODATA_HOST
    this.hostkey =
      options.hostkey ||
      process.env.SVC_KEY ||
      process.env.SOLID_KEY ||
      process.env.YODATA_POD_SECRET ||
      process.env.CLIENT_ID ||
      ''
    this.url = isurl(this.hostname) ? new URL(this.hostname) : null
    this.http = request(this)
  }

  use (fn) {
    fn(this)
    return this
  }

  resolve (path, hostname = this.profile.hostname) {
    // return new URL(path, this.hostname).href
    return uri.resolve(path, hostname)
  }

  /**
   * Get resource from target
   * @param {string} target - resource to fetch i.e. /container/{id}
   * @param {object} [options] - http options (got options)
   * @returns {Promise<YodataClientResponse>} HTTP response
   */
  async get (target, options) {
    return this.http.get(target, options)
  }

  /**
   * Write data to target with contentType header
   * @param {string} target - request path/url
   * @param {string|object} [data] - content to write
   * @param {object} [options] - got request options
   * @returns {Promise<YodataClientResponse>} HTTP response
   */
  put (target, data, options) {
    if (arguments.length === 1) {
      console.warn(
        'yodata-client:http curry functions deprecated, pluse use curry wrapper'
      )
      // @ts-ignore
      return async (data, options) => this.put(target, data, options)
    }
    return this.http.put(target, buildOptions(target, data, options))
  }

  /**
   * POST data to target with contentType header
   * @param {string} target - request path/url
   * @param {string|object} [data] - content to write
   * @param {object|string} [options] - got request options
   * @returns {Promise<YodataClientResponse>} HTTP response
   */
  async post (target, data, options) {
    if (arguments.length === 1) {
      console.warn(
        'yodata-client:http curry functions deprecated, pluse use curry wrapper'
      )
      // @ts-ignore
      return async data => this.post(target, data, options)
    }
    return this.http.post(target, buildOptions(target, data, options))
  }

  /**
   * Delete resource from target
   * @param {string} target - resource to fetch i.e. /container/{id}
   * @returns {Promise<YodataClientResponse>} HTTP response
   */
  async delete (target) {
    return this.http.delete(target)
  }

  /**
   * Fetch, parse and query keys on a json or yaml resource.
   *
   * @param {string} target - path (from the current profile.pod.orgin) or fully qualified href
   * @param {string|string[]} [key] - data key to return
   * @param {*} [defaultValue] - value to return if data[key] is null/undefined
   * @returns {Promise<any>} HTTP response
   */
  async data (target, key = 'data', defaultValue) {
    if (typeof key === 'string' && key !== 'data' && !key.startsWith('data.')) {
      key = `data.${key}`
    }
    return this.get(target)
      .then(returnKey(key, defaultValue))
      .catch(error => {
        const { response } = error
        if (defaultValue && response && response.statusCode === 404) {
          return defaultValue
        } else {
          const { statusCode, statusMessage, url } = response
          return [statusCode, statusMessage, url].join(' ')
        }
      })
  }

  /**
   * Set a key/value on a data resource
   *
   * @param {string} target - resource to update
   * @param {string} key - key to set
   * @param {any} value - value to set
   * @returns {Promise<YodataClientResponse>} HTTP response
   */
  async set (target, key, value) {
    return this.data(target, 'data', {})
      .then(setValue(key, value))
      .then(data =>
        this.put(target, data, {
          headers: {
            'x-api-key': this.hostkey
          }
        })
      )
  }

  async addToCollection (target, key, value) {
    const data = await this.data(target)
    const currentValue = getValue([key, []], data)
    if (Array.isArray(currentValue) && !arrayContains(value, currentValue)) {
      currentValue.push(value)
      setValue(key, currentValue, data)
      await this.put(target, data)
    }
    return data
  }

  async removeFromCollection (target, key, value) {
    const data = await this.data(target)
    const currentValue = getValue([key, []], data)
    if (Array.isArray(currentValue) && arrayContains(value, currentValue)) {
      const nextValue = removeFromCollection(value, currentValue)
      setValue(key, nextValue, data)
      await this.put(target, data)
    }
    return data
  }

  async assign (target, object) {
    return this.data(target, 'data', {})
      .then(assign(object))
      .then(data => this.put(target, data))
  }

  get origin () {
    return this.url ? this.url.origin : undefined
  }

  get profileURI () {
    return this.origin ? `${this.origin}/profile/card#me` : undefined
  }
}

module.exports = Client

function isurl (value) {
  return typeof value === 'string' && value.startsWith('http')
}
