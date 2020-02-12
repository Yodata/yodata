/** @format */

const { Command, flags } = require('@yodata/cli-tools')
const kindOf = require('kind-of')
const { URL } = require('url')

class CheckParentComand extends Command {
  async run () {
    const { target, fix } = this.props()
    const subject = await this.client.data(target)
    if (!hasparentorganization(subject)) { return this.log(`NO_PARENT_ORG:${target}`) }

    const parentid = subject.parentOrganization[0]

    const parent = await this.client.data(parentid)

    const subOrganizations = parent.subOrganization || []
    let haschild
    const targetURL = new URL(target)
    const origin = targetURL.origin
    const kind = kindOf(subOrganizations)
    switch (kind) {
      case 'string':
        // @ts-ignore
        haschild = String(subOrganizations)
          .toLowerCase()
          .includes(origin)
        break
      case 'array':
        // @ts-ignore
        haschild = JSON.stringify(subOrganizations)
          .toLowerCase()
          .includes(origin)
        break
      case 'object':
        // @ts-ignore
        haschild = JSON.stringify(subOrganizations)
          .toLowerCase()
          .includes(origin)
        break
      default:
        haschild = false
    }
    if (haschild === true) {
      return this.print(`${parentid} ${targetURL.href}`)
    } else if (fix === true) {
      parent.subOrganization.push(targetURL.href)
      const result = await this.client.put(parent.id, parent)
      this.print(`${parent.id} ${targetURL.href} ${result.statusCode}`)
    } else {
      this.print(`${parent.id} ${targetURL.href} MISSING`)
    }
  }
}

CheckParentComand.description = 'Tests that resource contains value'
CheckParentComand.args = [
  {
    name: 'target',
    type: 'string',
    desc: 'url/path to the target resource',
    required: true
  }
]
CheckParentComand.flags = Command.mergeFlags({
  fix: flags.boolean({
    description: 'fix add child to parent if missing',
    default: false
  })
})

module.exports = CheckParentComand

function hasparentorganization (subject) {
  const { id, parentOrganization } = subject
  return (
    typeof id === 'string' &&
    id.startsWith('http') &&
    Array.isArray(parentOrganization) &&
    parentOrganization.length > 0 &&
    typeof parentOrganization[0] === 'string' &&
    parentOrganization[0].startsWith('http')
  )
}
