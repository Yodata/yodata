'use strict'
const { URL } = require('url')

module.exports = resolveDomainSibling

/**
 *
 * @param {string} siblingName - target subdomain segment
 * @param {string} basehref - reference domain
 * @returns {string} sibling href
 */
function resolveDomainSibling (siblingName, basehref) {
  const baseurl = new URL(basehref)
  if (typeof siblingName === 'string') {
    const { host } = baseurl
    const segments = host.split('.')
    segments[0] = siblingName
    baseurl.host = segments.join('.')
  }

  return baseurl.href
}
