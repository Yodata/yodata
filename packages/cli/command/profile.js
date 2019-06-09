exports.command = 'profile'
exports.description = 'manage profile'
exports.builder = function (cli) {
  cli.updateStrings({
    'Commands:': 'Profile Commands:\n'
  })
  cli.commandDir('./profile_cmds/')
  cli.demandCommand()
  return cli
}
