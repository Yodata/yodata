const get = require('./get-object-value')

module.exports = function (key, defaultValue) {
  return function (value) {
    return get(key, value, defaultValue)
  }
}
