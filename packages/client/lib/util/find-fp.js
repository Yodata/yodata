const find = require('lodash/find')

module.exports = (search) => collection => find(collection, search)


