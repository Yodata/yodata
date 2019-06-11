const { Command } = require('@oclif/command')
const { hasProfile, useProfile, removeProfile, currentProfileName } = require('@yodata/config')

class RemoveProfileCommand extends Command {
  async run () {
    const { args } = this.parse(RemoveProfileCommand)
    const { name } = args
    if (hasProfile(name)) {
      removeProfile(name)
      if (currentProfileName() === name) {
        useProfile('default')
      }
      this.log(`${name} deleted.`)
    } else {
      this.error(`${name} not found.`)
    }
  }
}

RemoveProfileCommand.description = 'Remove a profile'
RemoveProfileCommand.args = [
  {
    name: 'name',
    description: 'profile to be removed',
    required: true
  }
]

module.exports = RemoveProfileCommand
