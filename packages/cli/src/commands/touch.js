const { Command } = require('@yodata/cli-tools')

class TouchCommand extends Command {
  async run () {
    this.log(this.props())
    const { target } = this.props()
    const { statusCode, headers, data } = await this.client.get(target)
    const contentType = headers[ 'content-type' ]
    if (statusCode === 200 && contentType.includes('application/json')) {
      this.client.put(target, data)
      this.print(target)
    } else {
      this.print(`not-json:${target}`)
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
