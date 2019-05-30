'use strict'

const config = require('@yodata/config')

module.exports = deleteProfile

/**
 * @param {string} name - name of the profile to be deleted
 */
function deleteProfile(name) {
	if (config.has(name)) {
		return config.delete(name)
	}

	throw new Error(`Profile ${name} not found.`)
}
