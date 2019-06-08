'use strict'
const Conf = require('conf')
const YODATA_PROFILE = process.env.YODATA_PROFILE || 'default'

/**
 * Local storage of yodata pod configuration and cached data
 *
 * @class Profile
 * @extends {Conf}
 */
class Profile extends Conf {
	/**
	 * Creates an instance of Profile.
	 * @param {string} [configName=YODATA_PROFILE]
	 */
	constructor(configName = process.env.YODATA_PROFILE || 'default') {
		const hostname = process.env.YODATA_POD_URL
		const hostkey = process.env.YODATA_POD_SECRET
		super({
			projectName: '@yodata/core',
			configName: configName,
			defaults: {
				name: configName,
				hostname,
				hostkey
			}
		})
		this.set('pod.url', hostname)
		this.set('pod.secret', hostkey)
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
}

module.exports = Profile
