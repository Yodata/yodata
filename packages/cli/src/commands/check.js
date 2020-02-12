/** @format */

const { Command } = require('@yodata/cli-tools')

class CheckCommand extends Command {
  async run () {
    const { target } = this.props()
    const subject = await this.client.data(target)
    if (
      subject &&
      subject.subOrganization &&
      Array.isArray(subject.subOrganization)
    ) {
      const current = subject.subOrganization
      const next = current.map(v =>
        String(v).endsWith('\r') ? v.trimRight(1) : v
      )
      if (arraysEqual(current, next)) {
        this.print(`${target} OK`)
      } else {
        subject.subOrganization = next
        const result = await this.client.put(target, subject, 'json')
        this.print(`${target} FIXED ${result.statusCode}`)
      }
    }
  }
}

CheckCommand.description = 'Checks validity of a profile resource'
CheckCommand.args = [
  {
    name: 'target',
    required: true,
    type: 'string',
    desc: 'url/path to the target resource',
    parse: input => {
      return input.startsWith('http') ? new URL(input).href : `https://${input}.bhhs.hsfaffiliates.com/profile/card#me`.toLowerCase()
    }
  }
]
CheckCommand.flags = Command.flags

module.exports = CheckCommand

function arraysEqual (a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  a.sort()
  b.sort()

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}
