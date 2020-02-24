const logRequest = require('./log-request')
const got = require('got')
const parseRespose = require('./parse-response')
const addSecurity = require('./add-security')

module.exports = createHTTPClient

/**
 * Returns an http client with defaults configured.
 *
 * @param {object} options - client settings
 * @param {string} [options.hostname] - base url i.e. http://example.com
 * @param {string} [options.hostkey] - pod authetication secret (x-api-key)
 * @returns {object} http client
 */

function createHTTPClient (options) {
  const { hostname } = options
  // @ts-ignore
  return got.extend({
    baseUrl: hostname,
    prefixUrl: hostname,
    hooks: {
      beforeRequest: [
        request => {
          if (request.url.pathname.startsWith('//')) {
            request.url.pathname = request.url.pathname.substr(1)
          }
        },
        addSecurity(options),
        logRequest

      ],
      afterResponse: [
        parseRespose
      ]
    }
  })
}
