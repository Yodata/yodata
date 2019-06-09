const config = require('@yodata/config')

module.exports = setInboxNext

/**
 * Pushes the provided value to inbox.history
 * updates inbox.history if needed
 * @param {string} value - next value to set
 */
function setInboxNext (value) {
  return config.profileSet('inbox.next', value)
}
