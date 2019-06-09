const { inbox } = require('@yodata/client')
const print = require('../../util/print')

exports.command = 'status'
exports.description = 'Get inbox status info'
exports.handler = print.command(inbox.status)
