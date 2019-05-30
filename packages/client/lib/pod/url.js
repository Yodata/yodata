'use strict'
const { URL } = require('url')
const config = require('@yodata/config')
const assert = require('assert-plus')

module.exports = getPodUrl

/**
 * Get a URL instance for the current pod
 * @returns {object} the url of the current pod
 */
function getPodUrl() {
	const profileName = config.getCurrentProfile()
	const target = `${profileName}.pod.url`
	assert.ok(config.profileHas(target), target)
	return new URL(config.getProfileValue('pod.url'))
}
