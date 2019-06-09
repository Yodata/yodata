const store = require('./store')
const Profile = require('./profile')

exports.Profile = Profile

const currentProfileName = () => store.get('currentProfileName', 'default')

exports.currentProfileName = currentProfileName

exports.currentProfile = () => {
	return new Profile(currentProfileName())
}

exports.useProfile = useProfile

function useProfile(name) {
	if (hasProfile(name)) {
		store.set('currentProfileName', name)
		return new Profile(name)
	}

	throw new Error(`profile ${name} not found.`)
}

exports.addProfile = addProfile

/**
 * Add a new profile
 * @param {object} info
 * @param {string} info.name
 * @param {string} info.hostname
 * @param {string} info.hostkey
 * @returns {Profile} the new profile
 */
function addProfile(info) {
	const { name } = info
	if (hasProfile(name)) {
		throw new Error(`profile ${name} exists.`)
	}

	store.set(`profile.${name}`, info)
	const profile = new Profile(name)
	profile.set(info)
	return profile
}

exports.removeProfile = removeProfile

function removeProfile(profileName) {
	return store.delete(`profile.${profileName}`)
}

exports.listProfiles = listProfiles

function listProfiles() {
	const result = []
	this.keys().sort().forEach(name => {
		const profile = store.get(`profile.${name}`)
		result.push([profile.name, profile.hostname])
	})
	return result
}

exports.hasProfile = hasProfile

function hasProfile(name) {
	return store.has(`profile.${name}`)
}

exports.keys = function () {
	return Object.keys(store.get('profile', {}))
}

exports.values = function () {
	return Object.values(store.get('profile', {}))
}

exports.count = () => this.keys().length

exports.toJSON = () => store.get('profile', {})

