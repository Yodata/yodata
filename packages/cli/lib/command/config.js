
exports.command = 'config <cmd>'
exports.description = 'view and manage yodata configuration'
exports.builder = function (cli) {
	cli.commandDir('./config_cmds/')
	return cli
}
