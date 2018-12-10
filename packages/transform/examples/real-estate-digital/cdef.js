const fs = require('fs-extra')
const yaml = require('js-yaml')
const src = fs.readFileSync('examples/real-estate-digital/cdef.yaml', 'utf8')
const cdef = yaml.load(src)
module.exports = cdef
