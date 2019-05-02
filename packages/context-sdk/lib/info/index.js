require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')
const config = require('@yodata/config')
const defaults = require('lodash/defaults')
const get = require('lodash/get')
const url = require('url')

module.exports = getContextInfo

/**
 * @typedef ContextInfoObject
 * @property {object} context
 * @property {string} context.$schema
 * @property {string} context.name
 * @property {string} context.description
 * @property {string} context.dirname
 * @property {string} context.contentType
 * @property {string} context.filename
 * @property {string} context.filepath
 * @property {string} context.url
 * @property {object} pod
 * @property {string} pod.url
 * @property {string} pod.secret
 *
 *
 *
 * get attributes of the current context
 *
 * @param {*} [props={}]
 * @returns {Promise<ContextInfoObject>}
 */
async function getContextInfo(props = {}) {
	return readPkgUp()
		.then(package => {
			const { environment, filename } = props
			const context = {}
			const pod = {}
			defaults(context, props.context, {
				name: get(package, 'pkg.name'),
				description: get(package, 'pkg.description'),
				contentType: 'application/x-yaml',
				environment: environment || 'stage',
			})

			const profilename = config.has(context.name) ? context.name : 'default'
			defaults(pod, {
				url: config.get(`${profilename}.pod.url`) || config.get('default.pod.url'),
				secret: config.get(`${profilename}.pod.secret`) || config.get('default.pod.secret')
			})
			context.dirname = (package && package.path) ? path.dirname(package.path) : path.join(process.cwd(), context.name)
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
}
