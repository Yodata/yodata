'use strict'

const path = require('path')
const url = require('url')

const logger = require('@yodata/logger')
const readPkgUp = require('read-pkg-up')
const defaults = require('lodash/defaults')
const getIn = require('lodash/get')

module.exports = getContextInfo

/**
 * @typedef ContextInfoObject
 * @property {object} [context]
 * @property {string} [context.$schema]
 * @property {string} [context.name]
 * @property {string} [context.description]
 * @property {string} [context.dirname]
 * @property {string} [context.contentType]
 * @property {string} [context.filename]
 * @property {string} [context.filepath]
 * @property {string} [context.url]
 * @property {object} [pod]
 * @property {string} pod.url
 * @property {string} pod.secret
 * @property {string} [environment]
 *
 *
 *
 * get attributes of the current context
 *
 * @param {object} [props]
 * @param {object} [props.context]
 * @param {object} [props.pod]
 * @param {string} [props.environment]
 * @param {string} [props.filename]
 * @returns {Promise<ContextInfoObject>}
 */
async function getContextInfo (props = {}) {
  const { environment = 'stage', filename, context = {}, pod = {} } = props
  return readPkgUp()
    .then(data => {
      defaults(context, {
        name: getIn(data, 'pkg.name'),
        description: getIn(data, 'pkg.description'),
        contentType: 'application/x-yaml',
        environment: environment || 'stage'
      })
      defaults(pod, {
        url: process.env.YODATA_POD_URL,
        secret: process.env.YODATA_POD_SECRET
      })

      context.dirname = (data && data.path) ? path.dirname(data.path) : path.join(process.cwd(), context.name)
      context.filename = filename || `${context.name}.cdef.yaml`
      context.filepath = path.join(context.dirname, context.filename)

      const segment = ['/public/context']
      if (typeof context.environment === 'string' && context.environment !== 'production') {
        segment.push(context.environment)
      }

      segment.push(context.filename)
      context.url = url.resolve(pod.url, path.join(...segment))
      return { ...props, context, pod }
    })
    .catch(error => {
      logger.error(error.message, error)
      throw new Error(error.message)
    })
}
