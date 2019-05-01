const copy = require('./copy-files')
const installDependencies = require('./install-dependencies')
const setProfile = require('../set-profile/set-profile')

module.exports = ({ templatePath }) => async function generateProject(props) {
	return copy(templatePath, props)
		.then(installDependencies)
		.then(setProfile)
}
