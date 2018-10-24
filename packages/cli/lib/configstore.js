'use strict'
const Store = require('configstore')
const pkg = require('../package.json')

module.exports = new Store(pkg.name)
