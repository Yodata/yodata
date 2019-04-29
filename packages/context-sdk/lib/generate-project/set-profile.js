const { config } = require('@yodata/cli')
module.exports = async function (props) {
	const info = require('../info/get-context-info')
	config.set('profile', info.packageName)
	config.profileSet('pod', info.pod)
}



