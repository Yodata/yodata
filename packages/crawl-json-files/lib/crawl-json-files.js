'use strict'
const assert = require('assert-plus')
const getJsonFiles = require('./get-data-files')

module.exports = crawlJsonFiles

/**
 * Calls handler for each JSON file in the target directory
 * @param {string} target - path to directory to be processed
 * @param {function(any): any} reducer - function to call for each json file
 * @param {object} [initialValue] - function to call for each json file
 */
async function crawlJsonFiles (target, reducer, initialValue = {}) {
  assert.string(target)
  assert.func(reducer)
  const files = await getJsonFiles(target)
  console.debug('files:', files)
  const result = files.reduce(reducer, initialValue)
  console.debug({ result })
  return result
}
