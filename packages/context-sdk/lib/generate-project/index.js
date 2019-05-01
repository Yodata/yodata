const copy = require('./copy-files')
const installDependencies = require('./install-dependencies')
const saveSettings = require('./save-settings')

module.exports = generateProject

async function generateProject(props) {
	return copy(props)
		.then(installDependencies)
		.then(saveSettings)
}
