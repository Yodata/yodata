const { Command } = require('@yodata/cli-tools')
const config = require('@yodata/config')

class UseCommand extends Command {
  async run () {
    const { args } = await this.parse(UseCommand)
    const profile = config.useProfile(args.profile)
    this.log(profile)
  }
}

UseCommand.description = 'Switch the active pod.'
UseCommand.args = [
  {
    name: 'profile',
    description: 'registered pod name',
    required: true
  }
]
UseCommand.flags = Command.flags

module.exports = UseCommand
