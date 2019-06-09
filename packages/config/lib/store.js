const Conf = require('conf')

const projectName = '@yodata/core'
const configName = '_userprofiles_'
const defaults = {
	currentProfileName: process.env.YODATA_PROFILE || 'default',
	profile: {
		'default': {
			name: 'default'
		}
	}
}
const schema = {
	currentProfileName: {
		type: 'string'
	},
	profile: {
		type: 'object',
		additionalProperties: {
			name: {
				type: 'string'
			},
			hostname: {
				type: 'string'
			},
			hostkey: {
				type: 'string'
			}
		}
	}
}

// @ts-ignore
const store = new Conf({ projectName, configName, defaults, schema })

module.exports = store
