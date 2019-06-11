const assert = require('assert-plus')

const store = require('./store')
const Profile = require('./profile')

exports.Profile = Profile

const currentProfileName = () => store.get('currentProfileName')
function getProfile (name) {
  return new Profile(store.get(`profile.${name}`))
}

exports.currentProfileName = currentProfileName

exports.currentProfile = () => {
  return getProfile(currentProfileName())
}

exports.useProfile = useProfile
exports.switch = useProfile

function useProfile (name) {
  if (hasProfile(name)) {
    store.set('currentProfileName', name)
    return new Profile(name)
  }

  throw new Error(`profile ${name} not found.`)
}

exports.addProfile = addProfile
exports.register = addProfile

/**
 * Add a new profile
 * @param {object} info
 * @param {string} info.name
 * @param {string} info.hostname
 * @param {string} info.hostkey
 * @returns {Profile} the new profile
 */
function addProfile (info) {
  const { name } = info
  assert.string(name, 'profile name')
  if (hasProfile(name)) {
    throw new Error(`profile ${name} exists.`)
  } else {
    store.set(`profile.${name}`, info)
    return useProfile(name)
  }
}

exports.removeProfile = removeProfile

function removeProfile (profileName) {
  store.delete(`profile.${profileName}`)
  const cv = currentProfileName()
  if (cv === profileName) {
    store.delete('currentProfileName')
  }
}

exports.listProfiles = listProfiles
exports.list = listProfiles

function listProfiles () {
  const result = []
  this.keys().sort().forEach(name => {
    const profile = store.get(`profile.${name}`)
    result.push([profile.name, profile.hostname])
  })
  return result
}

exports.hasProfile = hasProfile
exports.has = hasProfile

function hasProfile (name) {
  return store.has(`profile.${name}`)
}

exports.keys = function () {
  return Object.keys(store.get('profile', {}))
}

exports.values = function () {
  return Object.values(store.get('profile', {}))
}

exports.count = () => this.keys().length

exports.toJSON = () => JSON.stringify(store.store, null, 1)

exports.reset = () => store.clear()

exports.isEmpty = () => (this.count() === 0)

exports.isEqual = (key, value) => {
  return (store.get(key) === value)
}
