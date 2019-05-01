const sh = require('shelljs')
const path = require('path')
const logger = require('../util/logger')

module.exports = async function installDependencies(props) {
	logger.log(`\n\nInstalling Dependencies...\n\n`)
	const dest = path.resolve(process.cwd(), props.context.name)
	sh.cd(dest)
	sh.exec('npm install')
	return props
}
