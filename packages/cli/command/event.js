const client = require('@yodata/client')
const print = require('../lib/util/print')

exports.command = 'event'
exports.description = 'ls|publish'
exports.builder = function (cli) {
  cli.command('ls <topic>', 'list events', {}, print.command(client.event.list))
  cli.command('publish', 'publish to event recipient/topic', {
    r: {
      alias: 'recipient',
      description: 'event user/source'
    },
    t: {
      alias: 'topic',
      description: 'topic'
    },
    d: {
      alias: 'data',
      description: 'data (payload)'
    },
    f: {
      alias: 'filepath',
      description: 'path to message'
    }
  }, print.command(client.event.publish))
  cli.demandCommand()
  return cli
}
