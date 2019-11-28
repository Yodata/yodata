const assert = require('assert-plus')
const Conf = require('conf')
const Profile = require('./profile')

const options = {
  projectName: '@yodata/core',
  configName: '_userprofiles_',
  defaults: {
    currentProfileName: process.env.YODATA_PROFILE,
    profile: {}
  },
  schema: {
    currentProfileName: {
      type: 'string'
    },
    profile: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          hostname: { type: 'string' },
          hostkey: { type: 'string' }
        }
      }
    }
  }
}

class Store extends Conf {
  constructor (opts) {
    super(Object.assign({}, options, opts))
  }
  get currentProfileName () {
    return this.get('currentProfileName')
  }
  get currentProfile () {
    return this.get(profile(this.currentProfileName))
  }

  /**
   *
   * @param {object} info - profile info
   * @param {string} info.name - profile name
   * @param {string} info.hostname - profile hostname i.e. https://user.example.com
   * @param {string} info.hostkey - profile secret/x-api-key
   * @returns {Profile} the new profile
   */
  addProfile (info) {
    const { name } = info
    assert.string(name, 'profile name')
    if (this.hasProfile(name)) {
      throw new Error(`profile ${name} exists.`)
    } else {
      this.setProfile(name, info)
      return this.useProfile(name)
    }
  }
  getProfile (name, defaultValue) {
    return this.get(profile(name), defaultValue)
  }
  setProfile (name, value) {
    return this.set(profile(name), value)
  }
  useProfile (name) {
    if (this.hasProfile(name)) {
      this.set('currentProfileName', name)
      return new Profile(this.get(profile(name)))
    } else {
      throw new Error(`profile ${name} not found.`)
    }
  }
  listProfiles () {
    const result = []
    this.keys().sort().forEach(name => {
      const profile = this.getProfile(name)
      result.push([ profile.name, profile.hostname ])
    })
    return result
  }
  hasProfile (name) {
    return this.has(profile(name))
  }
  deleteProfile (name) {
    if (this.currentProfileName === name) {
      this.delete('currentProfileName')
    }
    this.delete(profile(name))
    return true
  }
  removeProfile (name) {
    return this.deleteProfile(name)
  }
  keys () {
    return Object.keys(this.get('profile', {})).sort()
  }
  values () {
    return Object.values(this.get('profile', {}))
  }
  count () {
    return this.keys().length
  }
  toJSON () {
    return JSON.stringify(this.store, null, 2)
  }
  reset () {
    this.clear()
    return true
  }
  isEmpty () {
    return this.count() === 0
  }
  toTable () {
    const result = []
    this.keys().sort().forEach(name => {
      const profile = this.getProfile(name)
      result.push([ profile.name, profile.hostname ])
    })
    return result
  }
}

Store.Profile = Profile

function profile (name) {
  return `profile.${name}`
}

module.exports = new Store(options)
