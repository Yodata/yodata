require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')
const config = require("@yodata/cli").config

const { YODATA_POD_URL, YODATA_POD_SECRET } = process.env

async function getContextInfo() {
	return readPkgUp()
		.then(package => {
			const cdef = {}
			cdef.packageName = package.pkg.name
			cdef.packagePath = package.path
			cdef.pod = {
				url: YODATA_POD_URL,
				secret: YODATA_POD_SECRET,
			}
			cdef.name = `${cdef.packageName}.cdef.yaml`
			cdef.path = path.resolve(cdef.packagePath, cdef.name)
			cdef.contentType = 'application/x-yaml'
			cdef.url = `${YODATA_POD_URL}/public/context/${cdef.name}`
			return cdef
		})
}

module.exports = getContextInfo
