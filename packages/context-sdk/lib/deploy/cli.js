#!/usr/bin/env node
/* eslint-disable no-unused-expressions */

const deploy = require('.')

require('yargs')
  .scriptName('deploy')
  .options({
    f: {
      alias: 'filepath',
      description: 'path to your context.yaml'
    },
    e: {
      alias: 'environment',
      description: 'stage | production',
      default: 'stage'
    },
    p: {
      alias: 'production',
      description: 'deploy to production',
      boolean: true,
      default: false
    }
  })
  .command('$0', 'deploy context', {}, deploy)
  .help()
  .argv
