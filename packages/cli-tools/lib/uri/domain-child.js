'use strict'
const { URL } = require('url')
const assert = require('assert-plus')

module.exports = resolveDomainChild

/**
 * Returns an href with a domain Child (subdomain) of basehref
 * @param {string} ChildName - target subdomain segment
 * @param {string} basehref - reference domain
 * @returns {string} Child href
 */
function resolveDomainChild (childName, basehref) {
  assert.string(childName)
  const url = new URL(basehref)
  const parent = url.host
  url.host = `${childName}.${parent}`
  return url.origin
}
