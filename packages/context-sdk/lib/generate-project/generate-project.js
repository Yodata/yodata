const copy = require('./copy-files')
const installDependencies = require('./install-dependencies')
const setProfile = require('../set-profile/set-profile')

module.exports = ({ source }) => async function generateProject(props) {
	return copy(source, props)
		.then(installDependencies)
		.then(setProfile)
}
