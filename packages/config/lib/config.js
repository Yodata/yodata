'use strict';

const Store = require('configstore')
const defaults = require('lodash/defaults')
const logger = console
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
exports.get = getValue
exports.set = setValue
exports.delete = deleteValue
exports.getCurrentProfile = getCurrentProfile
exports.getProfileValue = getProfileValue
exports.has = key => store.has(key)
exports.profileHas = key => store.has(profileKey(key))
exports.profileGet = key => store.get(profileKey(key))
exports.profileSet = (key, value) => store.set(profileKey(key), value)
exports.profileDelete = key => store.delete(profileKey(key))

function getProfileValue(key, defaultValue) {
	if (store.has(profileKey(key))) {
		return store.get(profileKey(key))
	}

	if (store.has(`default.${key}`)) {
		return store.get(`default.${key}`)
	}

	logger.error('config:not-found:${key}')
}

function getCurrentProfile() {
	const key = store.has('profile') ? store.get('profile') : 'default'
	return store.get(key)
}

function deleteValue(key) {
	store.delete(key)
	return `${key} deleted.`
}

function getValue(key, defaultValue) {
	if (store.has(key)) {
		return store.get(key)
	}

	logger.debug('config:not-found', { key })
}

function setValue(key, value) {
	store.set(key, value)
	return `${key} = ${value}`
}

function profileKey(key) {
	const profile = store.has('profile') ? store.get('profile') : 'default'
	return `${profile}.${key}`
}
