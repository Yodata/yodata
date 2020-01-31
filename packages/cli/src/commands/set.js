const { Command } = require('@yodata/cli-tools')
const setvalue = require('set-value')

class SetCommand extends Command {
  async run () {
    const { target, key, value } = this.props()
    const data = await this.client
      .data(target)
      .catch(() => ({ id: target }))
    const result = setvalue(data, key, value)
    this.print(result)
    return result
  }
}

SetCommand.description = `HTTP GET pod resource`
SetCommand.args = [
  {
    name: 'target',
    type: 'string',
    desc: 'url/path to the target resource',
    required: true
  },
  {
    name: 'key',
    type: 'string',
    desc: 'key to change',
    required: true
  },
  {
    name: 'value',
    type: 'string',
    desc: 'value',
    required: true
  }
]
SetCommand.flags = Command.flags

module.exports = SetCommand
