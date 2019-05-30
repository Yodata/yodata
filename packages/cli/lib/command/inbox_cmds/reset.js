const { inbox } = require('@yodata/client')

exports.command = 'reset'
exports.description = 'Reset your inbox cache'
exports.handler = () => inbox.reset()
