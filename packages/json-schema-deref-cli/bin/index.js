#!/usr/bin/env node
const js = require('json-schema-ref-parser')

const [nodePath, commandPath, target] = process.argv
js.dereference(target).then(response => {
  // @ts-ignore
  const result = (response && response.payload) ? response.payload : response
  console.log(JSON.stringify({ nodePath, commandPath, output: result }))
})
