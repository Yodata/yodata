'use strict'
const resolvePromises = require('p-props')

module.exports = context => async (data, initialValue) => {
  const map = context.map(data, initialValue)
  return resolvePromises(map)
}
