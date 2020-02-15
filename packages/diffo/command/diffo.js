const { Command } = require('@yodata/cli-tools')
const { detailedDiff } = require('deep-object-diff')

class DiffoCommand extends Command {
  async run () {
    const { filea, fileb } = this.props()
    this.print(detailedDiff(filea, fileb))
  }
}

DiffoCommand.args = [
  {
    name: 'filea',
    required: true,
    description: 'first file',
    hidden: false
  },
  {
    name: 'fileb',
    required: true,
    description: 'second file',
    hidden: false
  }
]

module.exports = DiffoCommand
