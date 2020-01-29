const { Command, flags } = require('@yodata/cli-tools')
const getvalue = require('get-value')

class GetCommand extends Command {
  async run () {
    const { target, key } = this.props()
    const data = await this.client.data(target)
    const result = String(key).length > 0 ? getvalue(data, key) : data
    this.print(result)
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
GetCommand.flags = Command.mergeFlags({
  key: flags.string({
    char: 'k',
    description: 'extract keys from value'
  })
})

module.exports = GetCommand
