const { subscription } = require('@yodata/client')
const print = require('../../util/print')

exports.command = 'add <agent> <topic>'
exports.description = 'add subscription'
exports.builder = {
  agent: {
    description: 'subscriber profile uri',
    type: 'string'
  },
  topic: {
    alias: 'object',
    description: 'i.e. realestate/contact',
    type: 'string'
  }
}
exports.handler = print.command(subscription.add)
