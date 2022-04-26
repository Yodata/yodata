const { Command, flags, uri } = require('@yodata/cli-tools')
const getvalue = require('get-value')

class GetCommand extends Command {
  async run () {
    const { target, key } = this.props()
    const hostname = this.profile.hostname
    const url = uri.resolve(target, hostname)
    // console.log({ target, hostname, url })
    const data = await this.client.data(url).catch(error => {
      const { response } = error
      if (response) {
        const { statusCode, statusMessage, url } = response
        return [statusCode, statusMessage, url].join(' ')
      } else {
        console.error({ error })
        throw new Error(`unexpected GET response ${error.message}`)
      }
    })
    const result = String(key).length > 0 ? getvalue(data, key) : data
    this.print(result)
    return result
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
  profile: flags.string({
    description: 'expands an id to full profile uri',
    char: 'P'
  })
})

module.exports = GetCommand
