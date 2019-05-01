const { config } = require('@yodata/cli')
const getContextInfo = require('../info')

module.exports = async function (props) {
	return getContextInfo()
		.then(info => {
			config.set('profile', info.packageName)
			config.profileSet('pod', info.pod)
			return props
		})
}



