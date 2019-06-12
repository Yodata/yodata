const { Command } = require('..')

class GetCommand extends Command {
  async run () {
    const { target } = this.props()
    const response = this.client.data(target)
    this.print(response)
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
