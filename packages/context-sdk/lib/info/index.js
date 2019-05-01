require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')
const config = require('@yodata/config')
const get = require('lodash/get')

async function getContextInfo(props = {}) {
	return readPkgUp()
		.then(package => {
			const context = props.context || {
				name: package.pkg.name,
				description: package.pkg.description
			}
			const profile = config.get(context.name, config.get('default'))
			const pod = {
				url: get(props, 'pod.url', get(profile, 'pod.url')),
				secret: get(props, 'pod.secret', get(profile, 'pod.secret')),
			}

			context.dirname = path.dirname(package.path)

			context.filename = `${context.name}.cdef.yaml`
			context.filepath = path.join(context.dirname, context.filename)
			context.contentType = 'application/x-yaml'
			context.url = pod.url + `/public/context/${context.filename}`
			return { context, pod }
		})
}

module.exports = getContextInfo
