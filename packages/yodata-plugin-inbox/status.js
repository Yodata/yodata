const config = require('@yodata/config')
const { href } = require('.')

module.exports = getInboxStatus

function getInboxStatus() {
	return Object.assign({}, { href: href(), ...config.profileGet('inbox') })
}
