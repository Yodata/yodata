const { Command, baseFlags } = require('./subscription-command')
const { addSubscription } = require('./addSubscription')
const { removeSubscription } = require('./removeSubscription')
const { replaceSubscription } = require('./replaceSubscription')
const { normalizeTarget } = require('./normalize-target')

exports.Command = Command
exports.baseFlags = baseFlags
exports.normalizeTarget = normalizeTarget
exports.addSubscription = addSubscription
exports.removeSubscription = removeSubscription
exports.replaceSubscription = replaceSubscription
