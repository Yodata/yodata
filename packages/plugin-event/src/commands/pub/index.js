
const { Command, flags } = require('@yodata/cli-tools')
const fs = require('fs')
const Path = require('path')
const JSONStream = require('JSONStream')
const es = require('event-stream')
const plimit = require('p-limit').default

const throttle = plimit(1)

const parse = key => {
  return async input => {
    if (typeof input[key] === 'string') {
      input[key] = JSON.parse(input[key])
    }
    return input
  }
}

const setValue = (key, value) => {
  return async input => {
    input[key] = value
    return input
  }
}

class PublishCommand extends Command {
  async run () {
    const client = this.client
    const {source,recipient} = await this.props()
    const sourcePath = Path.resolve(source)
    // const context = new Context({})
    return fs.createReadStream(sourcePath)
      .pipe(JSONStream.parse('*'))
      .pipe(es.map((event, cb) => {
        return parse('data.agent')(event)
          .then(parse('data.object'))
          .then(setValue('recipient', recipient))
          .then(async value => {
            const data = value
            await throttle(() => client.post('/publish/', data))
            cb(null, data)
          })
      }))
      .pipe(JSONStream.stringify())
      .pipe(process.stdout)
  }
}

PublishCommand.description = 'publish events from a file'
PublishCommand.aliases = ['publish']
PublishCommand.flags = Command.mergeFlags({
  output: flags.string({
    description: 'format output',
    char: 'o',
    default: 'yaml',
    options: [
      'yaml',
      'json',
      'table'
    ]
  }),
  recipient: flags.string({
    description: 'recipient',
    char: 'r',
    default: 'https://dave.dev.env.yodata.io/profile/card#me'
  }),
  topic: flags.string({
    description: 'topic',
    char: 't'
  }),
  cdefPath: flags.string({
    description: 'path to cdef',
    char: 'c'
  })
})

module.exports = PublishCommand
