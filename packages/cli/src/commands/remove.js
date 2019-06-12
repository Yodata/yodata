const { Command } = require('@oclif/command')
const store = require('@yodata/config')

class RemoveProfileCommand extends Command {
  async run () {
    const { args } = this.parse(RemoveProfileCommand)
    const { name } = args
    try {
      store.deleteProfile(name)
      this.log(`${name} deleted.`)
    } catch (error) {
      this.error(error.message)
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
