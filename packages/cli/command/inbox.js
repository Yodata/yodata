'use strict'
const { client } = require('../lib')

exports.command = ['inbox <cmd>', 'i']
exports.description = 'manage inbox'
exports.builder = function (cli) {
  // Cli.commandDir('./inbox_cmds/')
  cli.command('ls', 'list inbox items', {}, () => client.inbox.list().then(console.log))
  cli.demandCommand()
  return cli
}
