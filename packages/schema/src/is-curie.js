const curie = require('./curie-regexp')

module.exports = string => curie.test(string)
