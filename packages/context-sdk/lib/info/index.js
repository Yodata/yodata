require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')
const config = require('@yodata/config')
const defaults = require('lodash/defaults')
const get = require('lodash/get')

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
			console.log({ props, package })
			const { environment, filename, context, pod } = props
			defaults(context, {
				name: get(package, 'pkg.name'),
				description: get(package, 'pkg.description'),
				dirname: package && package.path ? path.dirname(package.path) : path.join(process.cwd(), context.name),
				contentType: 'application/x-yaml',
				environment: environment || 'stage'
			})
			defaults(pod, {
				url: config.get(`${context.name}.pod.url`) || config.get('default.pod.url'),
				secret: config.get(`${context.name}.pod.secret`) || config.get('default.pod.secret')
			})

			context.filename = filename || `${context.name}.cdef.yaml`
			context.filepath = path.join(context.dirname, context.filename)

			const segment = [pod.url, 'public/context']
			if (typeof environment === 'string' && environment !== 'production') {
				segment.push(environment)
			}
			segment.push(context.filename)
			context.url = path.join(...segment)
			return { ...props, context, pod }
		})
}
