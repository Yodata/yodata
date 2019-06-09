const { subscription } = require('@yodata/client')
const print = require('../../util/print')

exports.command = ['ls', 'list']
exports.description = 'list current subscriptions'
exports.builder = {
  output: {
    default: 'table'
  },
  keys: {
    default: ['index', 'agent', 'object']
  }
}
exports.handler = print.command(subscription.list)
