'use strict'
const { URL } = require('url')
const config = require('@yodata/config')

module.exports = resolveDomainSibling

function resolveDomainSibling(siblingName, basehref = config.getProfileValue('pod.url')) {
	const baseurl = new URL(basehref)
	if (typeof siblingName === 'string') {
		const { host } = baseurl
		const segments = host.split('.')
		segments[0] = siblingName
		baseurl.host = segments.join('.')
	}

	return baseurl.href
}
