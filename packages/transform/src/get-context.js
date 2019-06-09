'use strict'

const Context = require('./context')
const loadData = require('./load-data')

module.exports = getContext

/**
 * Fetch context from path or object
 *
 * @param {string|object} source
 * @param {object} [contextOptions]
 * @returns {Promise}
 *
 */
async function getContext (source, contextOptions) {
  let cdef
  if (typeof source === 'string') {
    cdef = await loadData(source)
  } else if (typeof source === 'object') {
    cdef = source
  }

  return new Context(cdef, contextOptions)
}
