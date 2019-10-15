const {Command} = require('@yodata/cli-tools')
const pMap = require('p-map')

const log = require('../log')
const util = require('../process-data')
const assert = require('assert-plus')

const WRITE_CONCURRENCY = Number(process.env.WRITE_CONCURRENCY) || 20
const data = {}

class CrawlProfileCommand extends Command {
  async run() {
    this.state = {
      target: this.prop.target,
      map: new Map(),
      blocked: new Set(data.blocked),
      result: new Map(),
    }
    await this.validate(this.state)

    let targetList = data.targetList || []
    if (targetList.length > 0) {
      log.info('target-list-provided')
    } else {
      log.info('crawl-profile-tree-start')
      await this.crawl(this.state.target)
      targetList = [...this.state.map.keys()]
      log.info('crawl-profile-tree-end')
    }

    const mapper = async target => {
      if (typeof target === 'string' && target.trim().length > 0) {
        const profile = await this.fetchTarget(target)
        log.info(target, profile)
      }
    }

    log.info(`process-items-start ${targetList.length}`)
    const result = await pMap(targetList, mapper, {concurrency: WRITE_CONCURRENCY})
    log.info(`process-items-end ${result.length}`)
    log.info('done')
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
    log.info(`fetched ${id} ${type} ${name}`)
    map.set(target, data)
    return data
  }

  async touchTarget(target) {
    if (typeof target === 'string' && target.trim().length > 0) {
      const data = await this.fetchTarget(target)
      return this.touch([target, data])
    }
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
    if (map.has(target)) {
      log.info(`duplicate ${target}`)
    } else if (blocked.has(target)) {
      log.info(`blocked ${target}`)
    } else {
      const data = await this.fetchTarget(target)
      map.set(target, data)
      if (Array.isArray(data.subOrganization)) {
        data.subOrganization = util.fixSubOrgIds(data.subOrganization)
        const crawler = this.crawl.bind(this)
        return pMap(data.subOrganization, crawler, {concurrency: 20})
      }
    }

    return map
  }

  async touchAll(state) {
    const touch = this.touch.bind(this)
    return pMap(
      state.map,
      touch,
      {concurrency: 20}
    )
  }

  async touch([target, data]) {
    if (this.state.blocked.has(target) || this.state.blocked.has(util.fixId(target))) {
      log.info(`blocked ${target}`)
      return `blocked ${target}`
    }

    assert.string(target, 'target')
    assert.object(data, 'object')
    assert.string(data.id, 'data.id')
    assert.string(data.type, 'data.type')

    const next = util.processProfileData(data)
    const {id, type, name} = next
    if (typeof id === 'string' && typeof type === 'string') {
      // update the profile (boom)
      const result = await this.client.put(id, next)

      if (result.statusCode === 204) {
        let message = `touched ${target} `
        if (target !== id) {
          message += ` > ${id} `
        }

        message += `${id} ${type} ${name}`
        log.info(message)
        log.debug(message, {target, id})
        return result
      }

      log.error(`touch-status-code ${result.statusCode}`)
    } else {
      log.error(`touch-id-or-type ${target}`)
      return null
    }
  }
}

CrawlProfileCommand.args = [
  {
    name: 'target',
    default: 'https://bhhs.hsfaffiliates.com/profile/card#me',
  },
]

CrawlProfileCommand.flags = Command.flags

CrawlProfileCommand.description = 'crawl proile subOrganizations recursively'
CrawlProfileCommand.aliases = ['crawl', 'tree']

module.exports = CrawlProfileCommand
