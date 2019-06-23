const { Command } = require('@yodata/cli-tools')
const store = require('@yodata/config')

class ListPodsCommand extends Command {
  async run () {
    const profiles = store.listProfiles()
    console.log()
    profiles.forEach(profile => {
      let [name, url] = profile
      console.log(`${String(name).padEnd(25)} ${String(url)}`)
    })
  }
}

ListPodsCommand.description = 'List registered profiles.'
ListPodsCommand.aliases = [ 'ls' ]
ListPodsCommand.flags = Command.flags

module.exports = ListPodsCommand
