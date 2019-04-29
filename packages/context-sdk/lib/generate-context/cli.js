#!/usr/bin/env node
const generateContext = require('.')
const path = require('path')
const [filename] = process.argv.slice(2)
const filepath = path.resolve(process.cwd(), filename)
const read = require('read-data')
const data = read.sync(filepath)

module.exports = generateContext(data)
