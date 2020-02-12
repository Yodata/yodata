const got = require('got')
const logRequest = require('./log-request')
const parseRespose = require('./parse-response')
const addSecurity = require('./add-security')

module.exports = createHTTPClient

/**
 * Returns an http client with defaults configured.
 *
 * @param {object} options
 * @param {string} [options.hostname] - base url i.e. http://example.com
 * @param {string} [options.hostkey] - pod authetication secret (x-api-key)
 * @returns {object} http client
 */

function createHTTPClient (instance) {
  const { hostname } = instance
  // @ts-ignore
  return got.extend({
    baseUrl: hostname,
    hooks: {
      beforeRequest: [logRequest, addSecurity(instance)],
      afterResponse: [parseRespose]
    }
  })
}
