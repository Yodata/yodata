const config = require('@yodata/config')
const print = require('../../util/print')

exports.command = ['rm <name>', 'delete']
exports.description = 'remove profile'
exports.handler = print.command(config.delete, 'name')
