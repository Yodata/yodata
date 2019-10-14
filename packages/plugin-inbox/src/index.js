const Conf = require('conf')
const sort = require('./sort-inbox-items')
const History = require('./history')
const projectName = '@yodata/plugin-inbox'
const getIn = require('lodash/get')

const INBOX_SCHEMA = {
  from: {
    type: 'string'
  },
  next: {
    type: 'string'
  },
  history: {
    type: 'array'

  },
  cache: {
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        next: {
          type: 'string'
        },
        contains: {
          type: 'array',
          items: {
            type: 'object'
          }
        }
      }
    }

  }
}

const cache = name => `cache.${name}`

class Inbox {
  constructor (client) {
    this.pathname = '/inbox/'
    this.client = client
    this.store = new Conf({ projectName, configName: client.name, schema: INBOX_SCHEMA, clearInvalidConfig: true })
    this.history = new History(this.store.get('history', []))
  }

  /**
   * List inbox items.
   *
   * @param {object} [props] - params
   * @param {string} [props.from] - start list from the provided token
   * @param {string} [props.by] - timestamp | time | token (default)
   * @param {string} [props.format] - list | full (default)
   * @param {string} [props.hours] - start -(value) hours
   * @returns {Promise<any>} http response
   * @memberof Inbox
   */
  async list (props) {
    const from = (props && props.from) || this.store.get('from')
    const pathname = this.pathname
    let target = this.pathname
    if (typeof from === 'string' && from.length > 0) {
      target = `${pathname}?from=${from}`
    }
    if (props && props.hours) {
      const hours = Number(props.hours)
      const now = new Date().getTime()
      const offset = hours * 3600000 // 1 hour in miliseconds
      const ts = new Date(now - offset).getTime()
      target = `${pathname}?by=timestamp&from=${ts}`
    }
    let response
    const targetIsCached = this.store.has(cache(target))
    if (targetIsCached) {
      // get data from cache
      let { next, contains } = this.store.get(cache(target))
      response = { next, contains }
    } else {
      // fetch data from pod
      response = await this.client.data(target)
      response.contains = sort([ 'timestamp' ], response.contains)
      if (response.contains.length >= 50) { // page is full -> ready for next
        // save data to cache
        this.store.set(cache(target), response)
        // update history
        this.store.set('next', response.next)
        if (typeof from === 'string' && from.length > 0) {
          this.store.set('from', from)
        }
      }
    }
    return this.toTable(response.contains)
  }

  toTable (items) {
    return items.map(message => ({
      index: message.index,
      time: Inbox.getMessageISODate(message),
      topic: Inbox.getMessageTopic(message),
      id: message.id ? message.id.split('/inbox/')[ 1 ] : '',
      subject: Inbox.getMessageSubject(message)
    }))
  }

  next (props = {}) {
    const from = this.store.get('next')
    return this.list({ ...props, from })
  }

  reset () {
    this.store.clear()
    return true
  }

  static getMessageTopic (message) {
    return getIn(message, 'topic') || getIn(message, 'object.topic') || ''
  }

  static getMessageISODate (message) {
    let ts = getIn(message, 'timestamp') || getIn(message, 'object.timestamp')
    return (ts) ? new Date(ts).toISOString() : '.'
  }

  static getMessageSubject (message) {
    return getIn(message, 'object.data.description') || getIn(message, 'data.object.id') || getIn(message, 'data.object.name') || getIn(message, 'data.object.type')
  }
}

module.exports = Inbox
