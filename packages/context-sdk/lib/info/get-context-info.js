require('dotenv').config()
const readPkgUp = require('read-pkg-up')
const path = require('path')
const config = require("@yodata/cli").config

const { YODATA_POD_URL, YODATA_POD_SECRET } = process.env

async function getContextInfo() {
	return readPkgUp()
		.then(package => {
			const cdef = {}
			const packageName = package.pkg.name
			const packagePath = package.path
			cdef.packageName = packageName
			cdef.packagePath = packagePath
			cdef.pod = {
				url: YODATA_POD_URL,
				secret: YODATA_POD_SECRET,
			}
			cdef.name = `${packageName}.cdef.yaml`
			cdef.path = path.relative(packagePath, cdef.name)
			cdef.contentType = 'application/x-yaml'
			cdef.url = `${YODATA_POD_URL}/public/context/${cdef.name}`
			return cdef
		})
}

module.exports = getContextInfo
