const { Command } = require('@yodata/cli-tools')

class TouchCommand extends Command {
  async run () {
    const { target } = this.props()
    const { statusCode, headers, data } = await this.client.get(target)
    const contentType = headers[ 'content-type' ]
    if (statusCode === 200 && contentType === 'application/json') {
      this.client.put(target, data)
      this.print(data)
    } else {
      this.error('only JSON content supported')
    }
  }
}

TouchCommand.description = `HTTP GET/PUT a resource.`
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
