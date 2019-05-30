const config = require('@yodata/config')
const print = require('../../util/print')

exports.command = 'get <key>'
exports.desc = 'get profile value'
exports.handler = print.command(config.profile.get, 'key')
