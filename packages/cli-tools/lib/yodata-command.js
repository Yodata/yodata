const { Command, flags } = require('@oclif/command')
const config = require('@yodata/config')
const Client = require('@yodata/client')
const print = require('./print')

const baseFlags = {
  output: flags.string({
    description: 'format output',
    char: 'o',
    default: 'yaml',
    options: [
      'yaml',
      'json',
      'table'
    ]
  })
}

function mergeFlags (flags = {}) {
  return { ...baseFlags, ...flags }
}

// @ts-ignore
class YodataCommand extends Command {
  get profile () {
    return config.currentProfile
  }
  get client () {
    return new Client(config.currentProfile)
  }
  static mergeFlags (flags) {
    return mergeFlags(flags)
  }
  props () {
    const { args, flags } = this.parse(this.ctor)
    return { ...args, ...flags }
  }
  print (data) {
    return print.result(this.props())(data)
  }
  log (data) {
    return print.result(this.props())(data)
  }
  showHelp () {
    this.print(this._help())
  }
  get prop () {
    const { args, flags } = this.parse(this.ctor)
    return { ...args, ...flags }
  }
}

YodataCommand.flags = baseFlags

exports.Command = YodataCommand
exports.flags = flags
exports.mergeFlags = mergeFlags
exports.baseFlags = baseFlags
