'use strict'

const fromHref = require('./from-href')
const isFile = require('./is-file')
const fromFile = require('./from-file')
const fromString = require('./from-string')
const isURL = require('./is-url')

module.exports = loadData

/**
 * Load data from a path to a yaml, json, js, or href
 * or, if not a path, try to parse the string as yaml/json
 *
 * @param {string} source - path, href or JSON/YAML value
 * @returns {Promise<object>} parsed value (if found)
 */
async function loadData(source) {
  if (typeof source !== 'string')
  throw new Error(`load-data:source:type:${typeof source}`)

  let data
  if (isURL(source)) {
    data = await fromHref(source)
  } else if (isFile(source)) {
    data = fromFile(source)
  } else {
    data = fromString(source)
  }

  return data
}
