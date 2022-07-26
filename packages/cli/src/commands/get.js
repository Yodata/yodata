const { Command, flags, select, mergeFlags } = require('@yodata/cli-tools')
const cliFlags = require('../util/cli-flags')

class GetCommand extends Command {
  async run () {
    const { key, each } = await this.props()
    const target = this.client.resolve(this.prop.target)
    const path = (this.prop.path) ? this.prop.path : undefined
    const location = path ? this.client.resolve(path, target) : this.client.resolve(target)
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
GetCommand.flags = mergeFlags({
  each: flags.string({
    type: 'string',
    description: 'if response is an array, return this key for each value'
  }),
  path: cliFlags.path
})

module.exports = GetCommand
