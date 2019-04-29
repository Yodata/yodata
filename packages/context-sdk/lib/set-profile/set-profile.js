const { config } = require('@yodata/cli')
const getContextInfo = require('../info/get-context-info')

module.exports = async function () {
	getContextInfo()
		.then(info => {
			config.set('profile', info.packageName)
			config.profileSet('pod', info.pod)
		})
}



