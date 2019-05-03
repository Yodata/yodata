const callerPath = require('caller-path')
const Yaml = require('js-yaml')
const Context = require('./context')
const fs = require('fs-extra')
const path = require('path')

/**
 *
 *
 * @param {string} filePath
 * @param {object} [contextOptions]
 * @returns {Object} Context instance
 */
module.exports = function loadContext(filePath, contextOptions) {
	const dirName = path.dirname(callerPath())
	const target = path.resolve(dirName, filePath)
	const extName = path.extname(target)
	let source
	let cdef
	switch (extName) {
		case '.yaml':
		case '.yml':
			source = fs.readFileSync(target, 'utf8')
			cdef = Yaml.load(source)
			break
		case '.json':
			source = fs.readFileSync(target, 'utf8')
			cdef = JSON.parse(source)
			break
		case '.js':
			cdef = require(target)
			break
		default:
			throw new Error(`unknown file type ${extName}`)
	}
	return new Context(cdef, contextOptions)
}
