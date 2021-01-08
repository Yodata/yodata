const kindof = require('kind-of')

function getTypedValue (value, currentValue) {
  const currentType = (kindof(currentValue) === 'array') ? kindof(currentValue[0]) : kindof(currentValue)
  let result
  switch (currentType) {
    case 'string':
      result = String(value)
      break
    case 'number':
      result = Number(value)
      break
    case 'date':
      result = new Date(value)
      break
    default:
      result = value
  }
  return result
}

module.exports = getTypedValue
