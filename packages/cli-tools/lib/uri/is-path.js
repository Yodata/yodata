/** @format */

function isPath (value) {
  return (
    typeof value === 'string' &&
    !value.startsWith('http') &&
    !value.includes('//') &&
    !value.endsWith(':') &&
    !(value.split(':').length === 2)
  )
}

module.exports = isPath
