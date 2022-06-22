const get = require('./get-object-value')
const select = require('./select')

module.exports = function (key, defaultValue) {
  return function (value) {
    if (String(key).includes(',')) {
      const selector = key.split(',')
      return select(selector, value.data)
    }
    return get(key, value, defaultValue)
  }
}
