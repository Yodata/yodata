const { Command, flags } = require('@yodata/cli-tools')
const getvalue = require('get-value')

class GetCommand extends Command {
  async run () {
    let { target, key, profile } = this.props()
    let domain
    if (profile === 'bhhs') {
      domain = 'bhhs.hsfaffiliates.com'
    }
    if (profile === 'rl') {
      domain = 'rl.hsfaffiliates.com'
    }
    if (profile === 'bhcre') {
      domain = 'reflex.bhcre.com'
    }
    if (domain) {
      target = `https://${target}.${domain}/profile/card#me`
    }
    const data = await this.client.data(target).catch(error => {
      const { response } = error
      if (response) {
        return [response.statusCode, response.statusMessage, response.url].join(' ')
      } else {
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
