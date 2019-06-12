const { Command } = require('..')
const config = require('@yodata/config')

class UseCommand extends Command {
  async run () {
    const { args } = this.parse(UseCommand)
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
