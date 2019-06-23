const { Command } = require('@yodata/cli-tools')
const config = require('@yodata/config')

class DumpCommand extends Command {
  async run () {
    this.print(config.store)
  }
}

DumpCommand.description = 'print config values'
DumpCommand.hidden = true
DumpCommand.flags = Command.flags

module.exports = DumpCommand
