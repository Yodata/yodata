const { Command } = require('@oclif/command')
const yc = require('@yodata/config')
const confirm = require('../util/confirm')

class NukeCommand extends Command {
  async run () {
    const confirmed = await confirm('delete all profile data')
    if (confirmed) {
      yc.reset()
      this.log('\nnuked.')
    } else {
      this.log('\nWhew. That was a close call.')
    }
  }
}

NukeCommand.description = `Reset your configuration
...
Warning! This will wipe all your saved pod credentials.
`

NukeCommand.hidden = true

module.exports = NukeCommand
