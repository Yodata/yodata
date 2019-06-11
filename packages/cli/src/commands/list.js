const { Command } = require('@oclif/command')
const store = require('@yodata/config')

class ListPodsCommand extends Command {
  async run () {
    const profiles = store.listProfiles()
    profiles.forEach(profile => {
      let [name, url] = profile
      this.log(`${String(name).padEnd(20)} ${String(url)}`)
    })
  }
}

ListPodsCommand.description = 'List registered profiles.'
ListPodsCommand.aliases = ['ls']

module.exports = ListPodsCommand
