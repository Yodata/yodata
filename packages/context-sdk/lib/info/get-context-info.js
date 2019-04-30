require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')

const { YODATA_POD_URL, YODATA_POD_SECRET } = process.env

async function getContextInfo() {
	return readPkgUp()
		.then(package => {
			const cdef = {}
			cdef.packageName = package.pkg.name
			cdef.packageDir = path.dirname(package.path)
			cdef.pod = {
				url: YODATA_POD_URL,
				secret: YODATA_POD_SECRET,
			}
			cdef.name = `${cdef.packageName}.cdef.yaml`
			cdef.path = path.join(cdef.packageDir, cdef.name)
			cdef.contentType = 'application/x-yaml'
			cdef.url = `${YODATA_POD_URL}/public/context/${cdef.name}`
			return cdef
		})
}

module.exports = getContextInfo
