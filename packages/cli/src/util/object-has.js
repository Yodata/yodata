const getvalue = require('get-value')

module.exports = function has (object, key, comparator) {
  const value = getvalue(object, key)
  switch (typeof comparator) {
    case 'undefined':
      return typeof value !== 'undefined'
    case 'function':
      return comparator(value)
    default:
      return value === comparator
  }
}
