const client = require('@yodata/client')
const print = require('../../util/print')

exports.command = 'ls'
exports.desc = 'list profiles'
exports.builder = {
  output: {
    default: 'table'
  }
}
exports.handler = print.command(client.profile.list)
