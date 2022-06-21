const { Command, flags } = require('@yodata/cli-tools')

class DeleteCommand extends Command {
  async run () {
    const { target, verbose } = await this.props()
    const response = await this.client.delete(target)
    if (verbose) {
      this.print(`DELETE ${target} ${response.statusCode}`)
    }
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
DeleteCommand.flags = Command.mergeFlags({
  verbose: flags.boolean({
    char: 'v',
    description: 'show verbose output i.e HTTP DELETE https://id.example.com/resource 204',
    default: true
  })
})

module.exports = DeleteCommand
