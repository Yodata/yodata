const config = require('@yodata/config')
const print = require('../../util/print')

exports.command = 'set <key> <value>'
exports.desc = 'set profile value'
exports.handler = props => {
	const { key, value } = props
	print.result(props)(config.profile.set(key, value))
}
