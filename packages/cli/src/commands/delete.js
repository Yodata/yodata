const { Command, flags } = require('@yodata/cli-tools')

class DeleteCommand extends Command {
  async run () {
    try {
      const { target, verbose } = await this.props()
      const targetHref = this.client.resolve(target)
      const response = await this.client.delete(targetHref)
      if (verbose) {
        this.print(`DELETE ${targetHref} ${response.statusCode}`)
      }
    } catch (error) {
      if (Number(error.statusCode) === 404) {
        this.print('NOT FOUND')
      } else {
        this.error(error.message)
      }
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
