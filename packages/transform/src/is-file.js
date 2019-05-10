'use strict'
const fs = require('fs')
const path = require('path')
const callerPath = require('caller-path')

module.exports = function isFile(target) {
	const dirName = path.dirname(callerPath())
	const pathname = path.resolve(dirName, target)
	return fs.existsSync(pathname)
}
