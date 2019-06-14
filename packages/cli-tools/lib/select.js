const pick = require('lodash/pick')
const kindOf = require('kind-of')
const get = require('lodash/get')

/**
 * Select object key(s)
 *
 * @param {string|string[]} selector
 * @param {object} [data]
 * @returns {object|object[]} object containing the selected keys only
 */
function select (selector, data) {
  if (arguments.length === 1) {
    return value => select(selector, value)
  }

  if (kindOf(data) === 'array') {
    return data.map(select(selector))
  }

  switch (kindOf(selector)) {
    case 'array':
      return pick(data, selector)
    case 'string':
      return get(data, selector)
    default:
      throw new TypeError(kindOf(selector))
  }
}

module.exports = select
