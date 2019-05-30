const config = require('@yodata/config')
const print = require('../../util/print')

exports.command = ['use <name>', 'switch']
exports.desc = 'set profile'
exports.handler = print.command(config.profile.use, 'name')
