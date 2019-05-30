
module.exports = isHost

function isHost(value) {
	return (typeof value === 'string' &&
		value.split('.').length >= 2 &&
		!(value.includes('/')))
}
