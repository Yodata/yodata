exports.command = ['subscription <command>', 'sub']
exports.description = 'subscription management'
exports.builder = function (cli) {
	cli.commandDir('./subscription_cmds/')
	cli.demandCommand()
	return cli
}
