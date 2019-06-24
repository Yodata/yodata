'use strict'
const { URL } = require('url')
const assert = require('assert-plus')

module.exports = resolveDomainSibling

/**
 * Returns a sibling (subdomain with the same parent) as basehref
 * @param {string} siblingName - target subdomain segment
 * @param {string} basehref - reference domain
 * @returns {string} sibling href
 */
function resolveDomainSibling (siblingName, basehref) {
  assert.string(siblingName)
  const url = new URL(basehref)
  const parent = url.host.split('.').slice(1).join('.')
  url.host = `${siblingName}.${parent}`
  return url.origin
}
