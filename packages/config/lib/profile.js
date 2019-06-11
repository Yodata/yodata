'use strict'

const Conf = require('conf')

/**
 * Local storage of yodata pod configuration and cached data
 *
 * @class Profile
 * @property {string} name - profile name
 * @property {string} hostkey - xapikey
 * @property {string} hostname - pod base url
 */
class Profile {
  /**
   * Creates an instance of Profile.
   * @constructor
   * @param {string|object} [options] - string (name) or options (name,hostname,hostkey)
   *
   */
  constructor (options) {
    const { YODATA_PROFILE, YODATA_POD_SECRET, YODATA_POD_URL } = process.env
    if (typeof options === 'string') {
      this.name = options
      this.hostname = YODATA_POD_URL
      this.hostkey = YODATA_POD_SECRET
    } else if (typeof options === 'object' && options !== null) {
      this.name = options.name || YODATA_PROFILE
      this.hostname = options.hostname || YODATA_POD_URL
      this.hostkey = options.hostkey || YODATA_POD_SECRET
    }
  }

  get url () {
    return this.hostname
  }

  get profile () {
    return this.name
  }

  get secret () {
    return this.hostkey
  }

  get pod () {
    return {
      url: this.hostname,
      secret: this.hostkey
    }
  }
}

Profile.prototype.toString = function () {
  return `${this.name} ${this.hostname}`
}

Profile.prototype.toJSON = function () {
  return JSON.stringify({ ...this }, null, 2)
}

Profile.prototype.toJS = function () {
  return { ...this }
}

module.exports = Profile
