#!/usr/bin/env node
const { info } = require('.')

info().then(console.log).catch(console.error)
