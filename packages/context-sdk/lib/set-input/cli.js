#!/usr/bin/env node
const setInput = require('.')
const path = require('path')
const [filename] = process.argv.slice(2)
const filepath = path.resolve(process.cwd(), filename)

setInput(filepath)
	.then(console.log)
	.catch(console.error)
