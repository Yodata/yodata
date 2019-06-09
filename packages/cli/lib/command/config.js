
exports.command = 'config'
exports.description = 'manage settings'
exports.builder = function (cli) {
  cli.commandDir('./config_cmds/')
  cli.updateStrings({
    'Commands:': 'Config Commands:\n'
  })
  cli.demandCommand()
  return cli
}

exports.handler = () => { }
