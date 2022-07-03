/** @format */

const { Command, mergeFlags, flags, logger } = require('@yodata/cli-tools')
const pMap = require('p-map')

const util = require('../process-data')
const fauxPublish = require('../fauxpublish')

const data = {
  blocked: [
    'https://null.bhhs.hsfaffiliates.com/profile/card#me',
    'https://null.bhhs.hsfaffiliates.com/profile/card',
    'https://.bhhs.hsfaffiliates.com/profile/card#me'
  ]
}

class CrawlProfileCommand extends Command {
  async run () {
    const { target } = await this.props()
    this.state = {
      target: this.client.resolve(target),
      map: new Map(),
      blocked: new Set(data.blocked),
      result: new Map(),
      errors: {},
      count: 0
    }
    await this.crawl(this.state.target)
      .catch(error => {
        logger.error(target, this.state.target, error.message)
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
    const props = await this.props()
    return this.client
      .data(target)
      .then(savedata({ map, target }))
      .then(async data => {
        if (String(props.publish).length > 0) {
          await fauxPublish(this.client, props.publish, data)
            .then(data => {
              const statusCode = data.statusCode || 201
              logger.debug(`${target} ${statusCode} PUBLISHED`)
            })
            .catch(error => {
              const statusCode = error.statusCode || 500
              const message = error.statusMessage || error.message
              logger.error(`PUBLISH_ERROR: ${target} ${statusCode} ${message}`)
            })
        }
        return data
      })
      .catch(error => {
        return `${target} ${error.statusCode || 500} ${error.statusMessage || error.message}`
      })
  }

  /**
   * traverse profile via subOrganization
   *
   * @param {string} target profile to crawl i.e. https://user.example.com/profile/card#me
   * @returns
   * @memberof CrawlProfileCommand
   */
  async crawl (target) {
    const { map, blocked, count } = this.state
    const { concurrency, values, checksuborgs } = await this.props()
    const location = this.client.resolve(target)

    if (map.has(location)) {
      logger.debug(`${location} DUPLICATE_SKIPPED`)
      return { id: location }
    }

    if (blocked.has(location)) {
      logger.debug(`${location} BLOCKED`)
      return {}
    }

    const data = await this.fetchTarget(location).catch(error => {
      this.state.errors[location] = { id: location, error: error.message }
    })

    map.set(location, data) // save data

    let output

    if (values === true) {
      if (count === 0) {
        output = '[\n'
        this.state.count += 1
      } else output = ',\n'
      output += JSON.stringify(data) + '\n'
    } else {
      output = location + '\n'
    }

    process.stdout.write(output)

    if (data && Array.isArray(data.subOrganization)) {
      data.subOrganization = util.fixSubOrgIds(data.subOrganization)
      const crawler = this.crawl.bind(this)
      if (data.type === 'RealEstateOffice') {
        if (checksuborgs) {
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
