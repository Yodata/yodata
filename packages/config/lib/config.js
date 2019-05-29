'use strict'
const Store = require('configstore')
const packageName = '@yodata/core'
const programDefaults = {
	profile: process.env.YODATA_PROFILE || 'default',
	default: {
		pod: {
			url: process.env.YODATA_POD_URL,
			secret: process.env.YODATA_POD_SECRET
		}
	}
}
const store = new Store(packageName, programDefaults)

exports.all = () => store.all
exports.currentProfile = getCurrentProfile
exports.delete = removev
exports.get = getv
exports.getCurrentProfile = getCurrentProfile
exports.getProfileValue = getpv
exports.has = hasv
exports.profileDelete = removepv
exports.profileGet = getpv
exports.profileHas = haspv
exports.profileSet = setpv
exports.set = setv
// @ts-ignore
exports.setProfile = setv('profile')
exports.profile = {
	name: getCurrentProfile,
	get: getpv,
	set: setpv,
	delete: removepv,
	has: haspv,
	// @ts-ignore
	use: setv('profile')
}

function storeHasProfile() {
	const profileName = store.get('profile')
	return (
		store.has('profile') &&
		typeof profileName === 'string' &&
		profileName.length > 0
	)
}

function validProfileName(value) {
	return (
		typeof value === 'string' &&
		value.length > 0
	)
}

const noProfile = () => !(storeHasProfile())

function pkey(key, profileOverride) {
	const profile = profileOverride || store.get('profile')
	return key ? `${profile}.${key}` : profile
}


/**
 * Returns the name of the current profile.
 * @returns {string} name of the current profile
 */
function getCurrentProfile() {
	return getv('profile', 'default')
}

/**
 * Remove a key from the store.
 *
 * @param {string} key - the key to delete
 * @returns {boolean} true if the item was deleted sucessfully
 */
function removev(key) {
	store.delete(key)
	return true
}

/**
 * Remove a profile key from the store.
 *
 * @param {string} key - the key to delete
 * @returns {boolean} true if the item was deleted sucessfully
 */
function removepv(key) {
	return removev(pkey(key))
}

/**
 * Retrieve a value from the store.
 *
 * @param {string} key - key to get
 * @param {*} [defaultValue] - value to return if the value is not in the store.
 * @returns {any}
 */
function getv(key, defaultValue) {
	return store.has(key) ? store.get(key) : defaultValue
}

/**
 * Get profile vaule
 * @param {string} key - key to get
 * @param {*} [defaultValue] - default value
 */
function getpv(key, defaultValue) {
	const pk = pkey()

	if (store.has(pkey(key))) {
		return store.get(pkey(key))
	}

	if (store.has(`default.${key}`)) {
		return store.get(`default.${key}`)
	}

	return defaultValue

}

/**
 * Set config key to value.
 *
 * @param {string} key - key to set
 * @param {any} value - value to set
 * @returns {function|*} - setter function or value
 */
function setv(key, value) {
	if (arguments.length === 1) {
		return value => setv(key, value)
	}
	// validation: profile must be string
	if ((key === 'profile' && typeof value !== 'string') || key.startsWith('profile.') ) {
		throw new TypeError('profile must be a string value')
	}

	store.set(key, value)
	return value
}


/**
 * Set profile value
 *
 * @param {string} key - key to set
 * @param {any} value - value to set
 */
function setpv(key, value) {
	return setv(pkey(key), value)
}


function hasv(key) {
	return store.has(key)
}

function haspv(key) {
	return hasv(pkey(key))
}
