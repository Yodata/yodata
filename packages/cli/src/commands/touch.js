const { Command } = require('@yodata/cli-tools')
const cliFlags = require('../util/cli-flags')
const logger = require('../util/logger')

class TouchCommand extends Command {
  async run () {
    const target = this.client.resolve(this.prop.target)
    const location = this.prop.path ? this.client.resolve(this.prop.path, target) : target
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
      const putResponse = await this.client.put(location, data, 'application/json')
      logger.info(`${location} ${putResponse.statusCode}`)
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
  path: cliFlags.path
})

module.exports = TouchCommand
