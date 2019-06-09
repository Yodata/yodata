const { Command } = require('@oclif/command')
const store = require('@yodata/config')

class ListPodsCommand extends Command {
  async run () {
    console.dir(store.listProfiles())
  }
}

ListPodsCommand.description = 'List registered profiles.'
ListPodsCommand.aliases = ['ls']

module.exports = ListPodsCommand
