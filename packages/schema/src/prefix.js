const n3 = require('n3')
const prefixIndex = require('./prefixIndex')

const prefix = n3.Util.prefixes(prefixIndex)

module.exports = prefix
