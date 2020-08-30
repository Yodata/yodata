const { Command } = require('@yodata/cli-tools')
const store = require('@yodata/config')

class ListPodsCommand extends Command {
  async run () {
    const profiles = store.listProfiles()
    const {search} = this.props()
    profiles.forEach(profile => {
      const [ name, url ] = profile
      let response = `${String(name).padEnd(40)} ${String(url)}`
      if (!search) {
        this.print(response)
      } else if (response.includes(search)) {
        this.print(response)
      }
    })
  }
}

ListPodsCommand.description = 'List registered profiles.'
ListPodsCommand.aliases = ['ls']
ListPodsCommand.flags = Command.flags
ListPodsCommand.args = [
  {
    name: 'search',
    description: 'only list pods that match search.',
    required: false
  }
]

module.exports = ListPodsCommand
