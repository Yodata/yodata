#!/usr/bin/env node

'use strict'
const transform = require('./index.js')
const yargs = require('yargs')

const prog = yargs
  .scriptName('transform')
  .command('$0 <datapath> <filepath>', 'apply context to data', {
    datapath: {
      type: 'string',
      default: 'input.json'
    },
    filepath: {
      type: 'string',
      default: 'cdef.yaml'
    }
  }, transform)
  .normalize('datapath')
  .normalize('filepath')

prog.argv()
