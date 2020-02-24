const { Command } = require('@yodata/cli-tools')

class DeleteCommand extends Command {
  async run () {
    const { target } = this.props()
    const response = await this.client.delete(target)
    this.print(response.statusCode)
  }
}

DeleteCommand.description = 'HTTP DELETE pod resource'
DeleteCommand.args = [
  {
    name: 'target',
    type: 'string',
    desc: 'url/path to the target resource',
    required: true
  }
]
DeleteCommand.flags = Command.flags

module.exports = DeleteCommand
