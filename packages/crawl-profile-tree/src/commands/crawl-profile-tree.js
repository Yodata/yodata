/** @format */

const { Command, mergeFlags, flags, logger } = require('@yodata/cli-tools')
const pMap = require('p-map')

const log = require('../log')
const util = require('../process-data')
const publish = require('../fauxpublish')

const data = {
  blocked: [
    'https://null.bhhs.hsfaffiliates.com/profile/card#me',
    'https://null.bhhs.hsfaffiliates.com/profile/card',
    'https://.bhhs.hsfaffiliates.com/profile/card#me'
  ]
}

class CrawlProfileCommand extends Command {
  async run () {
    this.state = {
      target: this.prop.target,
      map: new Map(),
      blocked: new Set(data.blocked),
      result: new Map(),
      errors: {},
      count: 0
    }
    await this.crawl(this.state.target)
      .catch(error => {
        log.error(error.message, { error })
        return error.message
      })
  }

  async validate (state) {
    return state
  }

  async fetchTarget (target) {
    if (String(target).trim().length === 0) {
      throw new Error('invalid target')
    }

    const { map } = this.state
    if (map.has(target) || map.has(util.fixId(target))) {
      return map.get(target)
    }

    const savedata = ({ map, target }) => async data => {
      map.set(target, data)
      return data
    }

    // go fetch the data
    return this.client
      .data(target)
      .then(savedata({ map, target }))
      .then(async data => {
        if (String(this.prop.publish).length > 0) {
          await publish(this.client, this.prop.publish, data)
        }
        return data
      })
      .catch(error => {
        this.state.errors[target] = error.message
        logger.error(error)
        return {}
      })
  }

  /**
   * traverse profile via subOrganization
   *
   * @param {string} target
   * @returns
   * @memberof CrawlProfileCommand
   */
  async crawl (target) {
    const { map, blocked, count } = this.state
    const concurrency = this.prop.concurrency

    if (map.has(target)) {
      log.debug(`duplicate ${target}`)
      return
    }
    if (blocked.has(target)) {
      log.debug(`blocked ${target}`)
      return
    }
    const data = await this.fetchTarget(target).catch(error => {
      this.state.errors[target] = { id: target, error: error.message }
    })

    map.set(target, data) // save data

    let output

    if (this.prop.values === true) {
      if (count === 0) {
        output = '[\n'
        this.state.count += 1
      } else output = ',\n'
      output += JSON.stringify(data) + '\n'
    } else {
      output = target + '\n'
    }

    process.stdout.write(output)

    if (data && Array.isArray(data.subOrganization)) {
      data.subOrganization = util.fixSubOrgIds(data.subOrganization)
      const crawler = this.crawl.bind(this)
      if (data.type === 'RealEstateOffice') {
        if (this.prop.checksuborgs) {
          console.log('CHECKING SUBORGS')
          const parent = data.id
          const nextSubOrganizations = []
          await Promise.all(data.subOrganization.map(async suborg => {
            const childparent = await this.client.data(suborg, 'parentOrganization', [])
            if (childparent.includes(parent)) {
              nextSubOrganizations.push(suborg)
            } else {
              console.error(`removing suborg ${suborg} from ${parent}`)
            }
            return suborg
          }))
          if (data.subOrganization.length === nextSubOrganizations.length) {
            console.log(`children of ${parent} are OK`)
          } else {
            data.subOrganization = nextSubOrganizations.sort()
            await this.client.put(parent, data)
            console.error(`children of ${parent} FIXED`)
          }
        } else {
          return pMap(data.subOrganization, crawler, { concurrency })
        }
      } else {
        return pMap(data.subOrganization, crawler, { concurrency })
      }
    }
    return map
  }
}

CrawlProfileCommand.args = [
  {
    name: 'target',
    default: 'https://bhhs.hsfaffiliates.com/profile/card#me'
  }
]

CrawlProfileCommand.flags = mergeFlags({
  key: flags.string({
    char: 'k',
    description: 'key to crawl',
    default: 'subOrganization'
  }),
  concurrency: flags.integer({
    char: 'c',
    description: 'number of concurrent threads',
    default: 10
  }),
  values: flags.boolean({
    char: 'v',
    description: 'output full objects, rather than just uris',
    default: false
  }),
  checksuborgs: flags.boolean({
    description: 'confirm all office suborgs have matching parentOrganization',
    default: false
  }),
  publish: flags.string({
    char: 'P',
    description: 'send update events to the profile uri provided',
    default: ''
  })
})

CrawlProfileCommand.description =
  'crawl http json objects recursively following a specified key'
CrawlProfileCommand.aliases = ['crawl', 'tree']

module.exports = CrawlProfileCommand
