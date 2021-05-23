const { isDeepStrictEqual } = require('util')

module.exports = function removeFromCollection (value, collection) {
  if (!Array.isArray(collection)) {
    throw new Error('collection provided is not an array')
  }
  const next = []
  collection.forEach(v => {
    if (!isDeepStrictEqual(v, value)) {
      next.push(v)
    }
  })
  return next
}
