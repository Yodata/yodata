'use strict'
/* eslint-disable no-unused-expressions */
'use strict'
require('dotenv').config()
const path = require('path')
const defaults = require('lodash/defaults')

module.exports = getProjectInfo

/**
 *
 * @param {object} context
 * @param {string} context.name
 * @param {string} context.description
 * @param {string} context.environment
 * @param {string} context.hostname
 * @param {string} [context.xapikey]
 * @param {string} [context.hostkey]
 * @param {string} [context.dirname]
 * @param {string} [context.filename]
 * @param {string} [context.filepath]
 * @param {string} [context.hostname]
 * @param {string} [context.hostpath]
 */
async function getProjectInfo (context) {
  const isCliInput = (context && typeof context.xapikey === 'string')
  defaults(context, {
    name: process.env.YODATA_PROFILE,
    contentType: 'application/x-yaml',
    environment: 'staging',
    dirname: isCliInput ? path.join(process.cwd(), context.name) : process.cwd(),
    filename: `${context.name}.cdef.yaml`,
    hostname: process.env.YODATA_POD_URL,
    hostkey: context.xapikey || process.env.YODATA_POD_SECRET
  })
  context.filepath = path.join(context.dirname, context.filename)
  context.hostpath = path.join('/public/context', context.environment, context.filename)
  context.url = new URL(context.hostpath, context.hostname).href
  return context
}
