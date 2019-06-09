const Conf = require('conf')

const projectName = '@yodata/core'
const configName = '_userprofiles_'
const defaults = {
	currentProfileName: process.env.YODATA_PROFILE || 'default',
	profiles: [],
	keys: []
}
const schema = {
	currentProfileName: {
		type: 'string'
	},
	profiles: {
		type: 'array',
		items: {
			type: 'string'
		}
	},
	profile: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
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
}

// @ts-ignore
const store = new Conf({ projectName, configName, defaults, schema })

module.exports = store
