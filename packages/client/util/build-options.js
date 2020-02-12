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
 *
 *
 * @param {string} target
 * @param {*} data
 * @param {string|object} [options]
 * @returns {RequestOptions}
 */
module.exports = function buildOptions (target, data, options = 'json') {
  let result = (typeof options === 'string') ? { headers: { 'content-type': options } } : options
  result = normalizeHeaders(result)

  switch (kindof(data)) {
    case 'null':
    case 'undefined':
      throw new Error('data cannot be null or undefined')
    case 'object':
      if (hasvalue(result, 'headers.content-type', v => String(v).includes('yaml'))) {
        result.body = YAML.stringify(data)
      } else {
        result.body = JSON.stringify(data, null, 1)
        result.headers['content-type'] = result.headers['content-type'] || 'application/json'
      }
      break
    default:
      result.body = data
  }
  return result
}
