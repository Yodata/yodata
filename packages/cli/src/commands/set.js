const { Command, flags } = require('@yodata/cli-tools')
const setvalue = require('set-value')
const getvalue = require('get-value')

class SetCommand extends Command {
  async run () {
    const { target, key, value, cleararray } = await this.props()
    const data = await this.client.data(target, undefined, {})
    const currentValue = getvalue(data, key)
    let result
    if (Array.isArray(currentValue)) {
      if (cleararray === true) {
        setvalue(data, key, [])
        result = await this.client.put(target, data, {
          headers: {
            'content-type': 'application/json',
            'x-api-key': this.client.hostkey
          }
        })
      } else if (!currentValue.includes(value)) {
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

SetCommand.description = 'Update a key value in an online JSON document'
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
    required: false
  }
]

SetCommand.flags = Command.mergeFlags({
  force: flags.boolean({
    description: 'force create resource if it does not already exist.',
    default: false,
    char: 'f'
  }),
  cleararray: flags.boolean({
    description: 'remove all values from an array',
    default: false,
    char: 'C'
  })
})

module.exports = SetCommand
