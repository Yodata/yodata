const store = require('./store')
const Profile = require('./profile')

exports.Profile = Profile

const currentProfileName = () => store.get('currentProfileName', 'default')

exports.currentProfileName = currentProfileName

exports.currentProfile = () => {
	const profileName = currentProfileName()
	return typeof profileName === 'string' ? new Profile(profileName) : undefined
}

exports.useProfile = useProfile

function useProfile(profileName) {
	this.addProfile(profileName)
	store.set('currentProfileName', profileName)
	return new Profile(profileName)
}

exports.addProfile = addProfile

/**
 * Adds a new profile to the store
 * @param {string} newProfileName
 * @returns {Profile}
 */
function addProfile(newProfileName) {
	const target = 'profiles'

	const profiles = new Set(store.get(target))
	profiles.add(newProfileName)
	store.set(target, [...profiles].sort())

	return new Profile(newProfileName)
}

exports.removeProfile = removeProfile

function removeProfile(profileName) {
	const key = 'profiles'
	const state = new Set(store.get(key))
	state.delete(profileName)
	const nextState = [...state]
	store.set(key, nextState)
	return nextState
}

exports.listProfiles = listProfiles

function listProfiles() {
	const response = []
	const profiles = store.get('profiles', [])
	const index = store.get('profile')
	profiles.forEach(profileName => {
		const profile = index[profileName]
		response.push([profile.name, profile.hostname])
	})
	return response
}

exports.hasProfile = profileName => store.get('profiles', []).includes(profileName)

exports.count = () => store.get('profiles', []).length

exports.keys = function () {
	return store.get('profiles')
}

exports.values = function () {
	const map = store.get('profile', {})
	return Object.values(map)
}
