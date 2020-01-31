const { Command, flags } = require('@oclif/command')
const config = require('@yodata/config')
const Client = require('@yodata/client')
const print = require('./print')

const baseFlags = {
  output: flags.string({
    description: 'format output',
    char: 'o',
    default: 'yaml',
    options: ['yaml', 'json', 'table']
  }),
  profile: flags.string({
    description: 'command context',
    char: 'p',
    default: () => config.currentProfileName
  })
}

function mergeFlags (flags = {}) {
  return { ...baseFlags, ...flags }
}

// @ts-ignore
class YodataCommand extends Command {
  get profile () {
    let profileName = this.prop.profile || config.currentProfileName
    return config.getProfile(profileName)
  }
  get client () {
    let profile = this.profile
    return new Client(profile)
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
  handleError (error) {
    this.error(error.message)
    return error.message
  }
}

YodataCommand.flags = baseFlags

exports.Command = YodataCommand
exports.flags = flags
exports.mergeFlags = mergeFlags
exports.baseFlags = baseFlags
