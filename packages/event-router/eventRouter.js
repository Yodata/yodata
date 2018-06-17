const Bloomrun = require('bloomrun')
const EventEmitter = require('events')
const assert = require('assert-plus')
const isFunction = require('lodash.isfunction')

class EventRouter extends EventEmitter {
  constructor () {
    super()
    this._filter = new Bloomrun({indexing: 'depth'})
  }

  /**
   * Adds a router event handler
   * @param {'beforeRoute'|'afterRoute'|'beforeAction'|'afterAction'} name
   * @param {function} action
  */
  addHook (name, action) {
    assert.string(name, 'name')
    assert.func(action, 'action')
    assert(['beforeRoute', 'afterRoute', 'beforeAction', 'afterAction'].includes(name), 'name should be one  of...')
    this._filter.add(name, action)
  }

  /**
   * Adds a new route and handler
   * @param {object|string} pattern
   * @param {*} payload
   */
  add (pattern, payload) {
    return this._filter.add(pattern, payload)
  }

  /**
   * Removes a route pattern
   * @param {object|string} pattern
   * @param {*} payload
   */
  remove (pattern, payload) {
    return this._filter.remove(pattern, payload)
  }

  /**
   * Sets a default payload to be returned when no pattern is matched.
   * This allows a single 'catch all' to be defined.
   * By default, null is returned when a pattern is not matched.
   * @param {*} payload
   */
  default (payload) {
    return this._filter.default(payload)
  }

  /**
   * @deprecated use .add
   * adds a route object matcher and handler
   * @param {object} pattern
   * @param {*} handler
   */
  registerRoute (pattern, handler) {
    return this._filter.add(pattern, handler)
  }

  /**
   * Looks up the first entry that matches the given obj.
   * A match happens when all properties of the added pattern matches with the one in the passed obj.
   * If a payload was provided it will be returned instead of the pattern.
   * @param {*} event
   * @returns {Function | null}
   */
  find (event) {
    return this._filter.lookup(event)
  }

  /**
   * returns all match handlers
   * @param {*} event
   * @returns {[]}
   */
  findAll (event) {
    return this._filter.list(event)
  }

  /**
   * true if the passed event has a matching handler
   * @param {!object} event
   * @returns {boolean}
   */
  hasRoute (event) {
    return (this.find(event) !== null)
  }

  handleError (error) {
    this.emit('error', error)
    throw new Error(error.message)
  }

  callRoute (match) {
    let router = this
    return async event => {
      let action = router.find(match)
      if (action) return isFunction(action) ? action(event) : action
      else return event
    }
  }

  /**
   * receives and event object and returns the result or result(event) if result is a function
   * @param {object} event
   * @returns {Promise}
   */
  async next (event) {
    let callRoute = this.callRoute.bind(this)
    let handleError = this.handleError.bind(this)
    return Promise.resolve(event)
      .then(callRoute('beforeRoute'))
      .then(callRoute('beforeAction'))
      .then(callRoute(event))
      .then(callRoute('afterAction'))
      .catch(handleError)
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
