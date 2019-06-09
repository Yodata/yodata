const store = require('./store')
const Profile = require('./profile')

exports.Profile = Profile

const currentProfileName = () => store.get('currentProfileName', 'default')

exports.currentProfileName = currentProfileName

exports.currentProfile = () => {
	const profileName = currentProfileName()
	return typeof profileName === 'string' ? new Profile(profileName) : undefined
}

exports.useProfile = function useProfile(profileName) {
	this.addProfile(profileName)
	store.set('currentProfileName', profileName)
	return new Profile(profileName)
}

exports.addProfile = function addProfile(profileName) {
	const key = 'profiles'
	const state = new Set(store.get(key))
	state.add(profileName)
	const nextState = [...state].sort()
	store.set(key, nextState)
	return nextState
}
exports.removeProfile = function removeProfile(profileName) {
	const key = 'profiles'
	const state = new Set(store.get(key))
	state.delete(profileName)
	const nextState = [...state]
	store.set(key, nextState)
	return nextState
}

exports.listProfiles = () => store.get('profiles')

exports.hasProfile = profileName => store.get('profiles', []).includes(profileName)



exports.count = () => store.get('profiles', []).length
