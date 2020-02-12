/** @format */

function isCurie (value) {
  return (
    typeof value === 'string' &&
    value.split(':').length === 2 &&
    value.length > 3
  )
}

module.exports = isCurie
