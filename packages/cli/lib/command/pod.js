exports.command = 'pod <cmd>'
exports.description = 'manage your pod'
exports.builder = function (cli) {
	cli.commandDir('./pod_cmds/')
	return cli
}
