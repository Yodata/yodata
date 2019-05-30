const { URL } = require('url')
const assert = require('assert-plus')
const config = require('@yodata/config')

const isValidUrl = require('./is-valid-url')
const isPath = require('./is-path')
const isHost = require('./is-host')
const isCurie = require('./is-curie')
const domainSibling = require('./domain-sibling')

module.exports = resolve

/**
 * Resolve a path relative to a base url (defaults to the current profile pod url
 *
 * @param {string} value - the string to resolve
 * @returns {string} resulting href
 */
function resolve(value) {
	const base = new URL(config.profileGet('pod.url'))

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
		const segments = base.host.split('.').splice(1)
		segments.unshift(root)
		const host = segments.join('.')
		return `${base.protocol}//${host}/${path}`
	}

	throw new Error(`resolve ${value} failed`)
}
