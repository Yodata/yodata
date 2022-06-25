const { Command, flags } = require('@yodata/cli-tools')
const setvalue = require('set-value')
const getvalue = require('get-value')

class SetCommand extends Command {
  async run () {
    let { target: location, key, value, cleararray } = await this.props()
    location = this.client.resolve(location)
    const data = await this.client.data(location, undefined, {})
    const currentValue = getvalue(data, key)
    let result
    if (Array.isArray(currentValue)) {
      if (cleararray === true) {
        setvalue(data, key, [])
        result = await this.client.put(location, data, 'application/json')
      } else if (!currentValue.includes(value)) {
        currentValue.push(value)
        setvalue(data, key, currentValue)
        result = await this.client.put(location, data, 'application/json')
      }
    } else {
      result = await this.client.set(location, key, value)
    }
    this.print(`${location} ${key} ${value} ${result.statusCode}`)
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
