const { Command } = require('@oclif/command')
const config = require('@yodata/config')

class DumpCommand extends Command {
  async run () {
    this.log(config.toJSON())
  }
}

DumpCommand.description = 'print config values'
DumpCommand.hidden = true

module.exports = DumpCommand
