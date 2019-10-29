const {Command, mergeFlags, flags} = require('@yodata/cli-tools')
const pMap = require('p-map')

const log = require('../log')
const util = require('../process-data')

const data = {
  blocked: [
    'https://null.bhhs.hsfaffiliates.com/profile/card#me',
    'https://null.bhhs.hsfaffiliates.com/profile/card',
  ],
}

class CrawlProfileCommand extends Command {
  async run() {
    this.state = {
      target: this.prop.target,
      map: new Map(),
      blocked: new Set(data.blocked),
      result: new Map(),
    }
    await this.crawl(this.state.target)
  }

  async validate(state) {
    return state
  }

  async fetchTarget(target) {
    const {map} = this.state

    if (String(target).trim().length === 0) {
      log.debug('received-blank-target')
      return null
    }

    if (map.has(target) || map.has(util.fixId(target))) {
      return map.get(target)
    }

    // go fetch the data
    let data = await this.client.data(target, 'data', null)
    if (data === null) {
      log.error(`target-not-found ${target}`)
      return null
    }

    const {type, id, name} = data
    log.debug(`fetched ${id} ${type} ${name}`)
    map.set(target, data)
    return data
  }

  /**
   * traverse profile via subOrganization
   *
   * @param {string} target
   * @returns
   * @memberof CrawlProfileCommand
   */
  async crawl(target) {
    const {map, blocked} = this.state
    const concurrency = this.prop.concurrency

    if (map.has(target)) {
      log.debug(`duplicate ${target}`)
    } else if (blocked.has(target)) {
      log.debug(`blocked ${target}`)
    } else {
      const data = await this.fetchTarget(target)
      process.stdout.write(`${this.prop.values ? JSON.stringify(data) : target}\n`)
      map.set(target, data)
      if (Array.isArray(data.subOrganization)) {
        data.subOrganization = util.fixSubOrgIds(data.subOrganization)
        const crawler = this.crawl.bind(this)
        return pMap(data.subOrganization, crawler, {concurrency})
      }
    }
    return map
  }
}

CrawlProfileCommand.args = [
  {
    name: 'target',
    default: 'https://bhhs.hsfaffiliates.com/profile/card#me',
  },
]

CrawlProfileCommand.flags = mergeFlags({
  key: flags.string({
    char: 'k',
    description: 'key to crawl',
    default: 'subOrganization',
  }),
  concurrency: flags.integer({
    char: 'c',
    description: 'number of concurrent threads',
    default: 1,
  }),
  values: flags.boolean({
    char: 'v',
    description: 'output full objects, rather than just uris',
    default: false,
  }),
})

CrawlProfileCommand.description = 'crawl proile subOrganizations recursively'
CrawlProfileCommand.aliases = ['crawl', 'tree']

module.exports = CrawlProfileCommand
