const { URL } = require('url')
const assert = require('assert-plus')

const isValidUrl = require('./is-valid-url')
const isPath = require('./is-path')
const isHost = require('./is-host')
const isCurie = require('./is-curie')
const isRootHost = require('./is-root-host')

module.exports = resolve

/**
 * Resolve a path relative to a base url (defaults to the current profile pod url
 *
 * @param {string} value - the string to resolve
 * @param {string} hostname - reference uri
 * @returns {string} resulting href
 */
function resolve (value, hostname) {
  const base = new URL(hostname)

  if (isValidUrl(value)) {
    return value
  }

  if (isPath(value)) {
    base.pathname = value
    return base.toString()
  }

  if (isHost(value)) {
    base.host = value
    return base.toString()
  }

  if (isCurie(value)) {
    const [root, path] = value.split(':')
    assert.string(root)
    assert.string(path)
    let segments = base.host.split('.')
    if (!isRootHost(base.origin)) {
      segments = segments.splice(1)
    }
    segments.unshift(root)
    const host = segments.join('.')
    return `${base.protocol}//${host}/${path}`
  }

  throw new Error(`resolve ${value} failed`)
}
