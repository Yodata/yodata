'use strict'

const path = require('path')
const detectProjectRoot = require('./detect-project-root')

module.exports = function (cwd, filePath) {
	return path.resolve(detectProjectRoot(cwd), filePath)
}
