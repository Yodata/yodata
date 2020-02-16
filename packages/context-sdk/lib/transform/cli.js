#!/usr/bin/env node

'use strict'

const transform = require('./index.js')
const yargs = require('yargs')

yargs
  .scriptName('transform')
  .command('$0 <datapath> <filepath>', 'apply context to data', {
    datapath: {
      type: 'string'
    },
    filepath: {
      type: 'string'
    }
  }, transform)
  .normalize('datapath')
  .normalize('filepath')
  .argv
