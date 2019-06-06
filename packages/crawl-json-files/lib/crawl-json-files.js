'use strict';
const getJsonFiles = require("./get-data-files");
const assert = require('assert-plus')

module.exports = crawlJsonFiles

/**
 * Calls handler for each JSON file in the target directory
 * @param {string} target - path to directory to be processed
 * @param {function} reducer - function to call for each json file
 * @param {object} [initialValue] - function to call for each json file
 */
async function crawlJsonFiles(target, reducer, initialValue = {}) {
	assert.string(target)
	assert.func(reducer)
	const files = getJsonFiles(target)
	// console.debug('files:', files)
	const result = files.reduce(reducer, initialValue)
	// console.debug({ result })
	return result
}
