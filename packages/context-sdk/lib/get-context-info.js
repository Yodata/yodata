require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')

const { YODATA_POD_URL } = process.env

async function getContextInfo() {
	return readPkgUp()
		.then(package => {
			const cdef = {}
			const packageName = package.pkg.name
			const packagePath = package.path
			cdef.name = `${packageName}.cdef.yaml`
			cdef.path = path.relative(packagePath, cdef.name)
			cdef.contentType = 'application/x-yaml'
			cdef.url = `${YODATA_POD_URL}/public/context/${cdef.name}`
			return cdef
		})
}

module.exports = getContextInfo
