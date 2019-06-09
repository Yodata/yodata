'use strict'
const Conf = require('conf')
const PROJECT_NAME = '@yodata/core'
const { YODATA_PROFILE } = process.env
const assert = require('assert-plus')

/**
 * Local storage of yodata pod configuration and cached data
 *
 * @class Profile
 * @extends {Conf}
 */
class Profile extends Conf {
	/**
	 * Creates an instance of Profile.
	 * @param {string} [profileName]
	 */
	constructor(profileName = YODATA_PROFILE) {
		assert.string(profileName)
		super({
			projectName: PROJECT_NAME,
			configName: profileName,
			defaults: {
				name: profileName,
				hostname: process.env.YODATA_POD_URL,
				hostkey: process.env.YODATA_POD_SECRET
			}
		})
	}

	get name() {
		// @ts-ignore
		return this._options.configName
	}

	get profile() {
		// @ts-ignore
		return this._options.configName
	}

	get hostname() {
		return this.get('hostname')
	}

	get url() {
		return this.get('hostname')
	}

	get hostkey() {
		return this.get('hostkey')
	}

	get secret() {
		return this.get('hostkey')
	}

	all() {
		return this.store
	}

	add(key, value) {
		const nextValue = new Set(this.get(key)).add(value)
		this.set(key, [...nextValue])
	}

	contains(key, value) {
		const source = this.get(key)
		return Array.isArray(source) && source.includes(value)
	}
}

module.exports = Profile
