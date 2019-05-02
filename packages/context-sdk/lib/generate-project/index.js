const copyFiles = require('./copy-files')
const installDependencies = require('./install-dependencies')
const saveSettings = require('./save-settings')
const getDefaults = require('../info')

module.exports = generateProject

async function generateProject(props) {
	return getDefaults(props)
		.then(copyFiles)
		.then(installDependencies)
		.then(saveSettings)
}
