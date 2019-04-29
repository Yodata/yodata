const sh = require('shelljs')
const path = require('path')
const logger = require('../util/logger')

module.exports = async function installDependencies(props) {
	logger.log(`

	Installing Dependencies...

	`)
	const dest = path.resolve(process.cwd(), props.sourceContext)
	sh.cd(dest)
	sh.exec('npm install')
	return props
}
