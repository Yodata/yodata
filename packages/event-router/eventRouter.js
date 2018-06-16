const Bloomrun = require('bloomrun')
const isFunction = require('lodash.isfunction')
const EventEmitter = require('events')

const callHandler = event => async handler => {
  return isFunction(handler) ? handler(event) : handler
}

class EventRouter extends EventEmitter {
  constructor () {
    super()
    this._matcher = new Bloomrun()
  }

  /**
   * adds a route object matcher and handler
   * @param {object} match
   * @param {*} handler
   */
  registerRoute (match, handler) {
    return this._matcher.add(match, handler)
  }
  /**
   * returns the first match or null if no match is found
   * @param {*} event
   * @returns {Function | null}
   */
  find (event) {
    return this._matcher.lookup(event)
  }

  /**
   * returns all match handlers
   * @param {function[]} event
   */
  findAll (event) {
    return this._matcher.list(event)
  }

  /**
   * true if the passed event has a matching handler
   * @param {!object} event
   * @returns {boolean}
   */
  hasRoute (event) {
    return this.find(event)
  }

  /**
   * receives and event object and returns the result or result(event) if result is a function
   * @param {object} event
   * @returns {Promise}
   */
  async next (event) {
    let handler = this.find(event)
    return callHandler(event)(handler)
  }

  /**
   * receives an event wrapped in an http request and returns the result or result(event)
   * @param {!object} req
   * @returns {Promise}
   */
  async nextHttp (req) {
    let { json } = require('micro')
    let event = await json(req)
    return this.next(event)
  }
}

module.exports = EventRouter
