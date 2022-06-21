const { Command, Flags } = require('@oclif/core')
const config = require('@yodata/config')
const Client = require('@yodata/client')
const print = require('./print')

const DEFAULT_OUTPUT_FORMAT = 'text'
const DEFAULT_COLOR = 'green'

const baseFlags = {
  output: Flags.string({
    description: 'format output',
    char: 'o',
    default: 'yaml',
    options: [ 'yaml', 'json', 'table', 'text' ]
  }),
  profile: Flags.string({
    description: 'command context',
    default: () => config.currentProfileName
  })
}

function mergeFlags(flags = {}) {
  return { ...baseFlags, ...flags }
}

// @ts-ignore
class YodataCommand extends Command {

  async init() {
    this.prop = await this.props()
  }

  get profile() {
    const profileName = config.currentProfileName
    return config.getProfile(profileName)
  }

  get client() {
    const profile = this.profile
    return new Client(profile)
  }

  static mergeFlags(flags = {}) {
    return { ...baseFlags, ...flags }
  }

  async props() {
    const { args, flags } = await this.parse(this.ctor)
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
    const props = await this.props()

    const output = options.output || props.output || 'text'
    const color = options.color || props.color || 'green'

    return print.result({ output, color })(data)
  }

  async log(data) {
    const { output = DEFAULT_OUTPUT_FORMAT, color = DEFAULT_COLOR } = await this.props()
    return print.result({ output, color })(data)
  }

  showHelp() {
    this.print(this._help())
  }

  // get prop() {
  //   return (async () => {
  //     const { args, flags } = await this.parse(this.ctor)
  //     return { ...args, ...flags }
  //   })
  // }

  handleError(error) {
    const { message, stack, statusCode, statusMessage, url } = error.request ? error.request : error
    const response = statusCode ? [ url, statusCode, statusMessage ].join(' ') : message
    return response
  }
}

YodataCommand.flags = baseFlags

exports.Command = YodataCommand
exports.flags = Flags
exports.mergeFlags = mergeFlags
exports.baseFlags = baseFlags
