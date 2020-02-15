#!/usr/bin/env node
'use strict'
const fs = require('fs')
const jsesc = require('jsesc')

const [target, dest] = process.argv.splice(2)
const clui = require('clui')

if (!(typeof target === 'string' && target.length > 0)) {
  console.error('error: target required')
  process.exit()
}

const { getJsonFiles, createReducer } = require('.')

const files = getJsonFiles(target)
const progressBar = new clui.Progress(100)
const totalFiles = files.length

const REDUCER_OPTIONS = {
  domainidentifier: 'description', // @type identifier
  indexValues: ['agent'],
  onfile: index => console.log(progressBar.update(index, totalFiles)),
  source: target,
  sampleSize: totalFiles
}
const reducer = createReducer(REDUCER_OPTIONS)

const result = files.reduce(reducer)
const output = formatOutput(result, REDUCER_OPTIONS)

if (typeof dest === 'string') {
  fs.writeFileSync(dest, output)
  console.log(`results => ${dest}`)
} else {
  console.dir(JSON.parse(output), { depth: 10 })
}

function formatOutput (data, reducerOptions) {
  // Convert model.values from js Set to Array
  const { indexValues } = reducerOptions
  if (Array.isArray(indexValues)) {
    indexValues.forEach(key => {
      const item = data.index.get(key)
      item.values = [...item.values]
      data.index.set(key, item)
    })
  }

  const result = { }
  result.source = data.source
  result.count = data.count
  result.keys = [...data.keys].sort()
  result.events = data.events
  result.model = createModel({ keys: result.keys, index: data.index })
  result.mock = createMock(result)

  // Result.count

  return jsesc(result, { json: true })
}

function createModel ({ keys, index }) {
  const result = {}
  keys.forEach(key => {
    result[key] = index.get(key)
  })
  return result
}

// function createObjectFromPairs (pairs, initialValue = {}) {
//   if (Array.isArray(pairs)) {
//     return pairs.reduce((result, [k, v]) => {
//       result[k] = v; return result
//     }, initialValue)
//   }
// }

function createMock ({ model }) {
  const mock = {}

  Object.entries(model).forEach(([key, props]) => {
    mock[key] = props.values || props.example
  })
  return mock
}
