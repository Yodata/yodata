const Config = require('@yodata/config')

module.exports = function (client) {
  this.store = new Config(client.name)
  this.list = getInboxHistory
  this.add = addToHistory
  this.last = getLastHistoryValue
  this.update = updateInboxHistory
  this.back = back
  return this
}

/**
 * Gets the inbox history
 * @returns {string[]} history of inbox next tokens
 */
function getInboxHistory () {
  return this.store.get('inbox.history', [])
}

function addToHistory (value) {
  const { store } = this
  const index = store.get('inbox.history', [])
  if (!index.includes(value)) {
    index.push(value)
    store.set('inbox.history', index)
  }

  return index
}

/**
 * Returns token from the last fetched inbox page
 * @returns {string|undefined} last inbox.history value
 */
function getLastHistoryValue () {
  const history = this.store.get('inbox.history', [])
  if (history.length > 0) {
    return history[history.length - 1]
  }

  return ''
}

/**
 * Update inbox history last and next value
 *
 * @param {string} last
 * @param {string} next
 * @param {any} next
 */
function updateInboxHistory (last, next) {
  this.addToHistory(last)
  this.store.set('inbox.last', last)
  this.store.set('inbox.next', next)
}

function back (count = 1) {
  const history = this.list()
  history.splice(-count)
  this.store.set('inbox.history', history)
  this.store.set('inbox.last', this.store.last())
  this.store.set('inbox.next', '')
}
