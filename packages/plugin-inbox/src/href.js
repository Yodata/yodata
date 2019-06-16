const resolve = require('../util/uri/path-resolve')

module.exports = getInboxUrl

/**
 * Returns the url of the current pod inbox (i.e. https://pod.example.com/inbox/)
 * @returns {string} url of the current pod inbox
 */
function getInboxUrl () {
  return resolve('/inbox/')
}
