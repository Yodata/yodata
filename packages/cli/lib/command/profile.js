exports.command = 'profile <command>'
exports.description = 'manage profile'
exports.builder = function (cli) {
	cli.commandDir('./profile_cmds/')
	cli.demandCommand()
	return cli
}
