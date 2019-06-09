'use strict'

module.exports = function (client) {
  /**
	 * Gets the list of inbox items from the last read position
	 * @param {object} [props] - the token to start from
	 * @param {string} [props.from] - the token to start from
	 * @param {string} [props.by] - the token to start from
	 * @param {string} [props.last] - start from last token
	 * @returns {Promise<any[]>} - array of inbox messages
	 */
  return async function listInboxItems (props = {}) {
    return client.data('/inbox/')
  }
}
