const { Command } = require('@yodata/cli-tools')
const getvalue = require('get-value')

class GetCommand extends Command {
  async run () {
    const { target, key } = this.props()
    const data = await this.client.data(target)
    const result = String(key).length > 0 ? getvalue(data, key) : data
    this.print(result)
    return result
  }
}

GetCommand.description = `HTTP GET pod resource`
GetCommand.args = [
  {
    name: 'target',
    type: 'string',
    desc: 'url/path to the target resource',
    required: true
  },
  {
    name: 'key',
    type: 'string',
    desc: 'get a specific key from the resource',
    required: false
  }
]
GetCommand.flags = Command.flags

module.exports = GetCommand
