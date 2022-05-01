const { Command, flags } = require('@oclif/command')
const config = require('@yodata/config')
const Client = require('@yodata/client')
const print = require('./print')

const baseFlags = {
  output: flags.string({
    description: 'format output',
    char: 'o',
    default: 'yaml',
    options: [ 'yaml', 'json', 'table' ]
  }),
  profile: flags.string({
    description: 'command context',
    default: () => config.currentProfileName
  })
}

function mergeFlags(flags = {}) {
  return { ...baseFlags, ...flags }
}

// @ts-ignore
class YodataCommand extends Command {
  get profile() {
    const profileName = this.prop.profile || config.currentProfileName
    return config.getProfile(profileName)
  }

  get client() {
    const profile = this.profile
    return new Client(profile)
  }

  static mergeFlags(flags = {}) {
    return { ...baseFlags, ...flags }
  }

  props() {
    const { args, flags } = this.parse(this.ctor)
    return { ...args, ...flags }
  }

  /**
   *
   * @param {*} data
   * @param {object} options
   * @param {string} options.output - text|json|yaml|table
   * @param {string} options.color - red|green|greenBright
   * @returns
   */
  async print(data, options = {}) {
    let output = options.output || this.prop.output || 'text'
    let color = options.color || this.prop.color || 'green'
    return print.result({ output, color })(data)
  }

  log(data) {
    return print.result(this.props())(data)
  }

  showHelp() {
    this.print(this._help())
  }

  get prop() {
    const { args, flags } = this.parse(this.ctor)
    return { ...args, ...flags }
  }

  handleError(error) {
    const { message, stack, statusCode, statusMessage, url } = error
    if (statusCode) {
      console.error([ statusCode, statusMessage, url ].join(' '))
    } else {
      console.error((message) + stack)
    }
  }
}

YodataCommand.flags = baseFlags

exports.Command = YodataCommand
exports.flags = flags
exports.mergeFlags = mergeFlags
exports.baseFlags = baseFlags
