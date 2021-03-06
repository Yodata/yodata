'use strict'

const path = require('path')
const callerPath = require('caller-path')
const Yaml = require('js-yaml')
const fs = require('fs-extra')
const Context = require('./context')

module.exports = loadContext

/**
 * fetch and load a transformation context
 *
 * @param {string} filePath - path/href to context value
 * @param {object} [contextOptions] - context options
 * @returns {Context} - a context instance
 */
function loadContext(filePath, contextOptions) {
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
