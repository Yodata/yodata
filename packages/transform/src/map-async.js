'use strict'
const pProps = require('p-props')
const kindOf = require('kind-of')

module.exports = context => async (data, initialValue) => {
  const map = context.map(data, initialValue)
  return resolvePromises(map)
}

async function resolvePromises(map) {
  const mapper = async value => {
    switch (kindOf(value)) {
    case 'object':
      return resolvePromises(value)
    default:
      return value
    }
  }
  const result = await pProps(map, mapper)
  return result
}
