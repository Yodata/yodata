'use strict'

const path = require('path')
const callerPath = require('caller-path')
const Yaml = require('js-yaml')
const fs = require('fs-extra')

module.exports = loadContext

/**
 *
 *
 * @param {string} filePath
 * @returns @instance Context
 */
function loadContext (filePath) {
  const dirName = path.dirname(callerPath())
  const target = path.resolve(dirName, filePath)
  const extName = path.extname(target)
  let source
  let content
  switch (extName) {
    case '.yaml':
    case '.yml':
      source = fs.readFileSync(target, 'utf8')
      content = Yaml.load(source)
      break
    case '.json':
      source = fs.readFileSync(target, 'utf8')
      content = JSON.parse(source)
      break
    case '.js':
      content = require(target)
      break
    default:
      throw new Error(`unknown file type ${extName}`)
  }

  return content
}
