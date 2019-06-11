const { Command, flags } = require('@oclif/command')
const config = require('@yodata/config')

class UseCommand extends Command {
  async run () {
    const { args } = this.parse(UseCommand)
    const profile = config.useProfile(args.profile)
    this.log(profile.toString())
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
UseCommand.flags = {
  output: flags.string({
    description: 'format output',
    char: 'o',
    options: [
      'yaml',
      'json'
    ]
  })
}

module.exports = UseCommand
