'use strict'

const config = require('@yodata/config')

module.exports = getCurrentProfile

/**
 * Returns the name of the current profile.
 * @returns {string} name of the current profile
 */
function getCurrentProfile() {
	return config.get('profile', 'default')
}
