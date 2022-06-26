/**
 * /* eslint-disable no-unused-expressions
 *
 * @format
 */

'use strict'

require('dotenv').config()
const path = require('path')

module.exports = getProjectInfo

/**
 * @typedef ContextInfo
 * @property {string} name - context name
 * @property {string} description - project description || id
 * @property {string} contentType - static: application/x-yaml
 * @property {string} dirname - full local path (/usr/local/...)
 * @property {"production"|"staging"} environment - production or staging (default)
 * @property {string} filename - cdef.yaml
 * @property {string} filepath - /usr/local/{name}.cdef.yaml
 * @property {string} hostkey - api key
 * @property {string} hostname - https://example.com
 * @property {string} hostpath - /public/context/{{name}}/{{environment}}/{{stage}}/{{veresion}}/cdef.yaml
 * @property {string} url - URL object
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
async function getProjectInfo (props = {}) {
  const PRODUCTION = 'production'
  const STAGING = 'stage'
  // @ts-ignore
  const env = process.env
  const context = {}
  const _default = {
    name: '',
    environment: 'stage',
    contentType: 'application/x-yaml',
    version: env.CONTEXT_VERSION || '1',
    hostname: env.SOLID_HOST || 'https://example.com',
    hostkey: env.SOLID_KEY || 'secret',
    filename: 'cdef.yaml'
  }

  const isCliInput = typeof props.xapikey === 'string'

  context.name = String(props.name || env.CONTEXT_NAME || _default.name)
  context.environment = props.production === true ? PRODUCTION : STAGING
  context.version = String(props.version || _default.version)
  context.contentType = String(props.contentType || _default.contentType)

  context.dirname = isCliInput
    ? path.join(process.cwd(), context.name)
    : process.cwd()
  context.filename = props.filename || _default.filename
  context.hostname = props.hostname || _default.hostname
  context.hostkey = props.xapikey || _default.hostkey

  context.filepath = path.join(context.dirname, context.filename)

  context.hostpath = path.join(
    '/public/context',
    String(context.name),
    String(context.environment),
    String(context.version),
    String(context.filename)
  )
//   console.log(context.hostpath)
//   console.log(context.hostname)
  context.url = new URL(context.hostpath, context.hostname).href
  context.origin = new URL(context.hostpath, context.hostname).origin
  context.description = props.description || context.url

  return context
}
