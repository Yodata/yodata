const { Command } = require('@yodata/cli-tools')

class GetCommand extends Command {
  async run () {
    const { target } = this.props()
    this.print(this.client.data(target))
  }
}

GetCommand.description = `HTTP GET pod resource`
GetCommand.args = [
  {
    name: 'target',
    type: 'string',
    desc: 'url/path to the target resource',
    required: true
  }
]
GetCommand.flags = Command.flags

module.exports = GetCommand
