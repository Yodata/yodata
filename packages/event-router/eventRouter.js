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

  registerRoute (match, handler) {
    return this._matcher.add(match, handler)
  }

  find (event) {
    return this._matcher.lookup(event)
  }

  findAll (event) {
    return this._matcher.list(event)
  }

  async next (event) {
    let handler = this.find(event)
    return callHandler(event)(handler)
  }

  async nextHttp (req) {
    let { json } = require('micro')
    let event = await json(req)
    return this.next(event)
  }
}

module.exports = EventRouter
