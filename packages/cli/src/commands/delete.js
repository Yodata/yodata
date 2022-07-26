const { Command, flags } = require('@yodata/cli-tools')

class DeleteCommand extends Command {
  async run () {
    const { verbose, path } = await this.props()
    const target = this.client.resolve(this.prop.target)
    const location = path ? this.client.resolve(path, target) : target
    try {
      const response = await this.client.delete(location)
      if (verbose) {
        this.print(`DELETE ${location} ${response.statusCode}`)
      }
    } catch (error) {
      if (Number(error.statusCode) === 404) {
        this.print(`DELETE ${location} ${error.statusCode}`, { color: 'red' })
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
