const { Command, flags } = require('@oclif/command')
const config = require('@yodata/config')
const Client = require('@yodata/client')
const print = require('./util/print')

const baseFlags = {
  output: flags.string({
    description: 'format output',
    char: 'o',
    default: 'yaml',
    options: [
      'yaml',
      'json'
    ]
  })
}

class YodataCommand extends Command {
  constructor (Argv, Lib) {
    super(Argv, Lib)
    this.yd = {
      client: new Client(config.currentProfile)
    }
    this.print = print.result
  }
  async init () {
    const { flags } = this.parse(this.constructor)
    this.flags = baseFlags
  }
}
YodataCommand.flags = baseFlags
exports.Command = YodataCommand
exports.flags = flags
