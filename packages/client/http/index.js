const got = require('got')
const logRequest = require('./log-request')
const parseRespose = require('./parse-response')

module.exports = createHTTPClient

/**
 * Returns an http client with defaults configured.
 *
 * @param {object} options
 * @param {string} [options.hostname] - base url i.e. http://example.com
 * @param {string} [options.hostkey] - pod authetication secret (x-api-key)
 * @returns {object} http client
 */

function createHTTPClient ({ hostname, hostkey }) {
  return got.extend(
    {
      baseUrl: hostname,
      headers: {
        'user-agent': '@yodata/client (https://yodata.io)',
        'x-api-key': hostkey
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
