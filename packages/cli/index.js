#!/usr/bin/env node

const program = require('commander')
const pkg = require('./package.json')

program.version(pkg.version)

require('autocmdr/lib/logger')(program)
require('autocmdr/lib/loader')(program)
require('autocmdr/lib/completion')(program)
require('autocmdr/lib/package')(program)
require('autocmdr/lib/config')(program)
require('autocmdr/lib/help')(program)

module.exports = program
