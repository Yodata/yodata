const {Command} = require('@yodata/cli-tools')

class InboxCommand extends Command {
  async run() {
    this.showHelp()
  }
}

InboxCommand.description = 'manage inbox items'

module.exports = InboxCommand
