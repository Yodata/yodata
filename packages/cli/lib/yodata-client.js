const got = require('got')

const getClient = idString => got.extend({headers: {'x-api-key': idString}})

module.exports = getClient
