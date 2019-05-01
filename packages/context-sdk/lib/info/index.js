require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')
const config = require('@yodata/config')

async function getContextInfo() {
	return readPkgUp()
		.then(package => {
			const cdef = {}
			const profile = package.pkg.name
			cdef.packageName = profile
			cdef.packageDir = path.dirname(package.path)
			cdef.pod = config.get(`{profile}.pod`)
			cdef.name = `${cdef.packageName}.cdef.yaml`
			cdef.path = path.join(cdef.packageDir, cdef.name)
			cdef.contentType = 'application/x-yaml'
			cdef.url = config.get(`${profile}.pod.url`) + `/public/context/${cdef.name}`
			return cdef
		})
}

module.exports = getContextInfo
