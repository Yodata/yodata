'use strict'
const fs = require('fs')
const path = require('path')
const callerPath = require('caller-path')
const yaml = require('js-yaml')

/**
 * loads a javascript object from a filepath
 *
 * @param {string} target
 * @returns {object}
 */
module.exports = function fromFile(target) {
	const dirName = path.dirname(callerPath())
	const pathname = path.resolve(dirName, target)
	const content = fs.readFileSync(pathname, 'utf8')
	const extName = path.extname(target)
	let data
	switch (extName) {
		case '.yaml':
		case '.yml':
			data = yaml.load(content)
			break
		case '.json':
			data = JSON.parse(content)
			break
		case '.js':
			data = require(target)
			break
		default:
			throw new Error(`unknown file type ${extName}`)
	}
	return data
}

