const { Command } = require('@yodata/cli-tools')
const setvalue = require('set-value')
const getvalue = require('get-value')

class SetCommand extends Command {
  async run () {
    const { target, key, value } = this.props()
    const data = await this.client.data(target)
    const currentValue = getvalue(data, key)
    let result
    if (Array.isArray(currentValue)) {
      if (!currentValue.includes(value)) {
        currentValue.push(value)
        setvalue(data, key, currentValue)
        result = await this.client.put(target, data, {
          headers: {
            'content-type': 'application/json',
            'x-api-key': this.client.hostkey
          }
        })
      }
    } else {
      result = await this.client.set(target, key, value)
    }
    this.print(`${target} ${key} ${value} ${result.statusCode}`)
    return result
  }
}

SetCommand.description = 'HTTP GET pod resource'
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
