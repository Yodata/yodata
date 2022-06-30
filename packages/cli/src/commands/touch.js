const { Command, flags } = require('@yodata/cli-tools')

class TouchCommand extends Command {
  async run () {
    const { target, path } = await this.props()
    const location = path ? this.client.resolve(path, target) : this.client.resolve(target)
    const { statusCode, headers, data } = await this.client
      .get(location)
      .catch(error => {
        return {
          statusCode: error.statusCode,
          headers: error.headers,
          data: {}
        }
      })
    const contentType = headers['content-type']
    if (statusCode === 200 && contentType.includes('application/json')) {
      await this.client.put(location, data, 'application/json')
    } else {
      this.print(`${location} ${statusCode}`)
    }
  }
}

TouchCommand.description = 'HTTP GET/PUT a resource.'
TouchCommand.args = [
  {
    name: 'target',
    type: 'string',
    desc: 'url/path to the target resource',
    required: true
  }
]
TouchCommand.flags = Command.mergeFlags({
  path: flags.string({
    char: 'p',
    description: 'overrides the path to your target resource',
    default: ''
  })
})

module.exports = TouchCommand
