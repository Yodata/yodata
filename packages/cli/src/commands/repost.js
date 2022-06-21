const { Command } = require('@yodata/cli-tools')

class RepostCommand extends Command {
  async run () {
    const { source, dest } = await this.props()
    const target = String(source).startsWith('http') ? source : dest + source
    const { statusCode, headers, data } = await this.client.get(target)
    const contentType = headers['content-type']
    if (statusCode === 200 && contentType.includes('application/json')) {
      const { headers } = await this.client.post(dest, data)
      this.print(headers.location)
    } else {
      this.print(`not-json:${source}`)
    }
  }
}

RepostCommand.description = 'Gets source and POST to dest, optionally delete the source after'
RepostCommand.args = [
  {
    name: 'source',
    type: 'string',
    desc: 'url to source file',
    required: true
  },
  {
    name: 'dest',
    type: 'string',
    desc: 'url to dest container',
    required: true
  }
]
RepostCommand.flags = Command.flags

module.exports = RepostCommand
