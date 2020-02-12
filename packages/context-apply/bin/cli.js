#!/usr/bin/env node
'use strict'
const meow = require('meow')
const applyContext = require('..')
const cli = meow(`
    Usage
      $ npx @yodata/apply-context <cdefyaml> <jsonsource> [target]
`)

const [cdef, source, target] = cli.input

applyContext(cdef, source, target)
