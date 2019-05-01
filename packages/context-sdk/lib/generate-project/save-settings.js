const config = require('@yodata/config')
const getContextInfo = require('../info')

module.exports = async function (props) {
	return getContextInfo(props)
		.then(info => {
			config.set('profile', info.context.name)
			config.profileSet('pod', info.pod)
			return props
		})
}
