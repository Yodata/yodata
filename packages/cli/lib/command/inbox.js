'use strict'

exports.command = ['inbox <cmd>', 'i']
exports.description = 'manage inbox'
exports.builder = function (cli) {
	cli.commandDir('./inbox_cmds/')
	cli.demandCommand()
	return cli
}
