#!/usr/bin/env node

(
  'use strict'
  require('yargs')
    .scriptName('transform')
    .options({
      datapath: {
        description: 'path to json or yaml file',
        demand: true
      },
      filepath: {
        alias: 'filepath',
        description: 'path to your context definition',
        default: 'cdef.yaml'
      },
      inverse: {
        alias: 'in',
        default: false,
        type: 'boolean'
      }
    })
    .normalize('datapath')
    .normalize('filepath')
    .command('', 'do it', {}, console.log)
    .argv)()
