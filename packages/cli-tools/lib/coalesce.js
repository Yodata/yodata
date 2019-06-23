const getValue = require('get-value')

module.exports = coalesce

/**
 * returns first key with a value
 * @param {string[]} keys
 * @param {object} collection
 * @returns {any|function} curried function or result
 */
function coalesce (keys, collection) {
  if (arguments.length === 1) {
    return collection => coalesce(keys, collection)
  }

  let i = 0
  let result
  do {
    result = getValue(collection, keys[i])
    i++
  } while (typeof result === 'undefined' && i < keys.length)
  return result
}
