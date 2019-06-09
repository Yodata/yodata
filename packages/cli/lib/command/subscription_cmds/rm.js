const { subscription } = require('@yodata/client')
const print = require('../../util/print')

exports.command = ['rm <index>', 'delete']
exports.description = 'remove subscription by index'
exports.builder = {
  index: {
    type: 'number',
    description: 'subscription index to remove'
  },
  output: {
    default: 'table'
  }
}
exports.handler = print.command(subscription.delete)
