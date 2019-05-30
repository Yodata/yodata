const getPodUrl = require('./url')

module.exports = () => {
	const url = getPodUrl()
	return url.hostname
}
