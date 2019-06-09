const fs = require('fs')
const path = require('path')

const defaultFilter = dirent => true

/**
 * Gets a list of JSON files from target directory
 * @param {string} target path to folder to be processed
 * @returns {string[]} list of JSON filepaths
 */
function getDataFiles (target, filter = defaultFilter) {
  const result = []
  const dirents = fs.readdirSync(target, { withFileTypes: true })
  dirents.forEach(item => {
    if (item.isFile && filter(item)) {
      result.push(path.resolve(target, item.name))
    }
  })
  return result
}

module.exports = getDataFiles
