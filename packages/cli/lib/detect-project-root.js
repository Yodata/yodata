'use strict'

const path = require('path')
const fsutils = require('./fsutils')

module.exports = function(cwd) {
	let projectRootDir = cwd || process.cwd()
	while (
		!fsutils.fileExistsSync(path.resolve(projectRootDir, './firebase.json'))
	) {
		const parentDir = path.dirname(projectRootDir)
		if (parentDir === projectRootDir) {
			return null
		}
		projectRootDir = parentDir
	}
	return projectRootDir
}
