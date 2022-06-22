const { Command, flags, select } = require('@yodata/cli-tools')

class GetCommand extends Command {
  async run () {
    const { target, key, each } = await this.props()
    const location = this.client.resolve(target)
    const print = this.print.bind(this)
    return await this.client.data(location, key)
      .then(data => {
        if (each && Array.isArray(data)) {
          const selector = each.split(',')
          return select(selector, data)
        } else {
          return data
        }
      })
      .then(result => this.print(result))
      .catch(error => {
        const { statusCode, statusMessage, url } = error.response ? error.response : error
        const { message } = error
        if (statusCode) {
          print(['GET', url, key, statusCode, statusMessage].join(' '))
        } else {
          print([message].join('\n'))
        }
      })
  }
}

GetCommand.description = 'HTTP GET pod resource'
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
GetCommand.flags = Command.mergeFlags({
  each: flags.string({
    description: 'if response is an array, return this key for each value'
  })
})

module.exports = GetCommand
