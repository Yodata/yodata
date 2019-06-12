const { Command } = require('../yodata-command')

class GetCommand extends Command {
  async run () {
    const { args, flags } = this.parse(GetCommand)
    const client = this.yd.client
    this.print(flags)(client.get(args.target).then(res => res.data))
  }
}

GetCommand.description = `HTTP GET pod resource`
GetCommand.args = [
  {
    name: 'target',
    type: 'string',
    desc: 'url/path to the target resource',
    required: true
  }
]
GetCommand.flags = {
  ...Command.flags
}

module.exports = GetCommand
