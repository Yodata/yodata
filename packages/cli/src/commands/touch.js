const { Command } = require('@yodata/cli-tools')

class TouchCommand extends Command {
  async run () {
    const { target } = await this.props()
    const location = this.client.resolve(target)
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
      this.client.put(location, data, 'application/json')
      this.print(`PUT ${location} ${statusCode}`)
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
TouchCommand.flags = Command.flags

module.exports = TouchCommand
