const kindof = require('kind-of')
const YAML = require('../util/yaml')
const normalizeHeaders = require('./normalize-headers')
const hasvalue = require('./has-value')
/**
 * @typedef RequestOptions
 * @property {string|stream} body
 * @property {object} headers
 * @property {string} prefixURL
 * @property {number} retry
 */

/**
 * build request options
 *
 * @param {string} target
 * @param {*} data
 * @param {string|object} [options]
 * @returns {RequestOptions}
 */
module.exports = function buildOptions (target, data, options = 'application/json') {
  let response = (typeof options === 'string') ? { headers: { 'content-type': options } } : options
  response = normalizeHeaders(response)

  switch (kindof(data)) {
    case 'null':
    case 'undefined':
      throw new Error('data cannot be null or undefined')
    case 'object':
      if (hasvalue(response, 'headers.content-type', v => String(v).includes('yaml'))) {
        response.body = YAML.stringify(data)
      } else {
        response.body = JSON.stringify(data, null, 1)
        response.headers['content-type'] = response.headers['content-type'] || 'application/json'
      }
      break
    default:
      response.body = data
  }
  return response
}
