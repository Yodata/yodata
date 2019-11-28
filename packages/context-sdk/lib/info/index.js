/* eslint-disable no-unused-expressions */
'use strict'

require('dotenv').config()
const path = require('path')

module.exports = getProjectInfo

/**
 * @typedef ContextInfo
 * @property {string} description - project description || id
 * @property {string} contentType - static: application/x-yaml
 * @property {string} dirname - full local path (/usr/local/...)
 * @property {string} environment - production or staging (default)
 * @property {string} filename - {name}.cdef.yaml
 * @property {string} filepath - /usr/local/{name}.cdef.yaml
 * @property {string} hostkey - api key
 * @property {string} hostname - https://example.com
 * @property {string} hostpath - /public/context/{environment}/{name}.cdef.yaml
 * @property {string} name - context name
 * @property {string} url - {hostname}{hostpath}
 */

/**
 *
 * @param {object} [props]
 * @param {string} props.name
 * @param {string} props.description
 * @param {string} props.environment
 * @param {string} props.hostname
 * @param {string} props.xapikey
 * @returns {Promise<ContextInfo>} project info
 */
async function getProjectInfo (props) {
  // @ts-ignore
  const { name, description, hostname, xapikey, environment, production } = props || {}
  const isCliInput = (typeof xapikey === 'string')
  const context = {}
  context.name = name || process.env.YODATA_PROFILE
  context.contentType = 'application/x-yaml'
  context.environment = (production === true) ? 'production' : environment || 'stage'
  context.dirname = isCliInput ? path.join(process.cwd(), context.name) : process.cwd()
  context.filename = `${context.name}.cdef.yaml`
  context.hostname = hostname || process.env.YODATA_POD_URL
  context.hostkey = xapikey || process.env.YODATA_POD_SECRET
  context.filepath = path.join(context.dirname, context.filename)
  context.hostpath = path.join('/public/context', context.environment, context.filename)
  context.url = new URL(context.hostpath, context.hostname).href
  context.description = description || context.url

  return context
}
