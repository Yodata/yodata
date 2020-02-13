'use strict'
const getContext = require('./get-context')

module.exports = compileContext

/**
 * Fetch a conext by path or url and return an async context.map helper function
 *
 * @param {string} target
 * @param {object} [contextOptions]
 * @returns {Promise<function>}
*/
async function compileContext(target, contextOptions) {
  const context = await getContext(target, contextOptions)

  return async function (data/** @param {object} */) {
    return context.map(data)
  }
}
