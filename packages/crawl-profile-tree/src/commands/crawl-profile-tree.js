/** @format */

const { Command, mergeFlags, flags } = require('@yodata/cli-tools')
const pMap = require('p-map')

const log = require('../log')
const util = require('../process-data')

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

    // go fetch the data
    return this.client
      .data(target)
      .then(data => {
        map.set(target, data)
        return data
      })
      .catch(error => {
        this.state.errors[target] = error.message
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
      return pMap(data.subOrganization, crawler, { concurrency })
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
    default: 1
  }),
  values: flags.boolean({
    char: 'v',
    description: 'output full objects, rather than just uris',
    default: false
  })
})

CrawlProfileCommand.description =
  'crawl http json objects recursively following a specified key'
CrawlProfileCommand.aliases = ['crawl', 'tree']

module.exports = CrawlProfileCommand
