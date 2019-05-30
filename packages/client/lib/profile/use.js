'use strict'
const assert = require('assert-plus')
const config = require('@yodata/config')

module.exports = useProfile
/**
 * Sets the current profile to <name>
 * @param {string} name - profile name to set
 * @returns {string} the new profile name
 */
function useProfile(name) {
	assert.string(name, 'profile name must be a string')
	config.set('profile', name)
	return name
}
