/** @format */

const gv = require('get-value')

module.exports = function getValue (object, key, defaultValue) {
  return gv(object, key, { default: defaultValue })
}
