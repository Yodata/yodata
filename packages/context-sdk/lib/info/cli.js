#!/usr/bin/env node

/* eslint-disable no-unused-expressions */

const info = require('../info')
require('yargs')
  .scriptName('npx info')
  .env('YODATA')
  .option('output', { alias: 'o', describe: 'output', global: true })
  .command('$0', 'return package info', {}, infoCommand)
  .help()
  .argv

function infoCommand (args) {
  console.log(info(args))
}
