const copy = require('./copy-files')
const installDependencies = require('./install-dependencies')
const setProfile = require('../set-profile')

module.exports = generateProject

async function generateProject(props) {
	return copy(props)
		.then(installDependencies)
		.then(setProfile)
}
