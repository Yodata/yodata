const yaml = require('js-yaml')

exports.parse = yamlParse
exports.stringify = yamlStringify

/**
 * Parse a yaml formatted string
 *
 * @param {string} string
 * @returns {object}
 */
function yamlParse (string) {
  return yaml.load(string)
}

/**
 * Encode object to yaml format
 *
 * @param {object} object - javascript object to be stringified
 * @returns {string} yaml formatted object
 */
function yamlStringify (object) {
  return yaml.dump(object, { sortKeys: false, skipInvalid: true })
}
