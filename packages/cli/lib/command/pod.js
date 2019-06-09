exports.command = 'pod <cmd>'
exports.description = 'manage pods'
exports.builder = function (cli) {
  cli.commandDir('./pod_cmds/')
  cli.updateStrings({
    'Commands:': 'Pod commands:\n'
  })
  return cli
}
