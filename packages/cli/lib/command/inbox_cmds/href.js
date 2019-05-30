const { inbox } = require('@yodata/client')
const print = require('../../util/print')

exports.command = 'href'
exports.description = 'gets url of the current inbox'
exports.handler = print.command(inbox.href)

