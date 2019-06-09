const { inbox } = require('@yodata/client')
const print = require('../../util/print')

exports.command = ['rm <index>', 'delete']
exports.description = 'remove inbox item by index'
exports.builder = {
  index: {
    type: 'number',
    description: 'item to remove'
  },
  output: {
    default: 'table'
  }
}
exports.handler = print.command(inbox.delete)
