const { Command } = require('@oclif/command')
const yc = require('@yodata/config')

const EMPTY =
`A girl is no one.

$ yodata register - to configure your first pod.
`
class WhoamiCommand extends Command {
  async run () {
    if (yc.isEmpty()) {
      this.log(EMPTY)
    } else {
      this.log(yc.currentProfile().toString())
    }
  }
}

WhoamiCommand.description = 'Get the current profile name'
WhoamiCommand.aliases = ['who']

module.exports = WhoamiCommand
