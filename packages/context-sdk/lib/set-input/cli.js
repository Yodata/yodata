#!/usr/bin/env node
const path = require('path')
const setInput = require('.')

const [filename] = process.argv.slice(2)
const filepath = path.resolve(process.cwd(), filename)

setInput(filepath)
  .then(console.log)
  .catch(console.error)
