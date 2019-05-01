require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')
const config = require('@yodata/config')
const get = require('lodash/get')
const defaults = require('lodash/defaults')

async function getContextInfo(props = {}) {
	return readPkgUp()
		.then(package => {
			const { environment, filename, context, pod } = props
			defaults(context, {
				name: package.pkg.name,
				description: package.pkg.description,
				dirname: path.dirname(package.path)
			})
			defaults(pod, {
				url: config.get(`${context.name}.pod.url`) || config.get('default.pod.url'),
				secret: config.get(`${context.name}.pod.secret`) || config.get('default.pod.secret')
			})
			context.filename = filename || `${context.name}.cdef.yaml`
			context.filepath = path.join(context.dirname, context.filename)
			context.contentType = 'application/x-yaml'
			context.url = `${pod.url}/public/context/`
			if (environment && environment !== 'production') {
				context.url += `${environment}/`
			}
			context.url += context.filename
			return { context, pod }
		})
}

module.exports = getContextInfo
