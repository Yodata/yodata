function isValidUrl (value) {
  return (
    typeof value === 'string' &&
		value.startsWith('http')
  )
}

module.exports = isValidUrl
