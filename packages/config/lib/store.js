const Conf = require('conf')
const projectName = '@yodata/core'
const configName = '_userprofiles_'
const defaults = {
	currentProfileName: process.env.YODATA_PROFILE || 'default',
	profiles: []
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
	}
}

const store = new Conf({ projectName, configName, defaults, schema })

module.exports = store
