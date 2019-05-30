'use strict'
const config = require('@yodata/config')

module.exports = listProfiles

/**
 * @returns {Promise<object>}
 */
async function listProfiles() {
	const configmap = config.all() || {}
	delete configmap.profile
	const profiles = Object.keys(configmap) || []
	return profiles.filter(profile => config.has(`${profile}.pod.url`)).sort().reduce((result, name) => {
		result.push({ profile: name, url: config.get(`${name}.pod.url`) })
		return result
	}, [])
}
