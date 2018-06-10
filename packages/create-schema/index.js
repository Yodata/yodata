#!/usr/bin/env node
const shx = require('shelljs')
const root = shx.pwd()
const src = root + '/node_modules/@yodata/create-schema/src'
const dest = root + 'schema'

shx.cp('-r', src, dest)
if (shx.exec('npm install').code === 1) {
  shx.echo('done')
  shx.exit(1)
}
