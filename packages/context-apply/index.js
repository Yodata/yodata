'use strict'
const fs = require('fs')
const { loadContext, plugin } = require('@yodata/transform')
const transformPluginView = require('@yodata/transform-plugin-view')
const JSONStream = require('JSONStream')
const Path = require('path')
const assert = require('assert-plus')
const es = require('event-stream')

function parseKey (key, object) {
  if (object && object[ key ] && typeof object[ key ] === 'string') {
    object[key] = JSON.parse(object[key])
  }
  return object
}

module.exports = (contextPath, sourcepath, targetpath) => {
  assert.string(contextPath, 'context path')
  assert.string(sourcepath, 'sourcepath')
  assert.optionalString(targetpath, 'target path')

  const pathOf = {
    context: Path.resolve(contextPath),
    source: Path.resolve(sourcepath),
    target: Path.resolve(targetpath || `out.${sourcepath}`)
  }

  const context = loadContext(pathOf.context)
  context
    .use(plugin.defaultValues)
    .use(plugin.keyOrder)
    .use(transformPluginView)

  const transformMessage = (message) => {
    try {
      if (typeof message === 'string' && (message[ 0 ] === '{' || message[ 0 ] === '[')) {
        message = JSON.parse(message)
      }
      parseKey('data', message)
      parseKey('data.object', message)
      parseKey('data.object', message)
      return context.map(message)
    } catch (error) {
      console.error(`${error.message}:id:${message.id}`)
      return null
    }
  }

  const src = fs.createReadStream(pathOf.source)

  let sp = Path.parse(pathOf.source)
  let dp = Path.resolve(sp.name + '.out' + sp.ext)
  let dest = fs.createWriteStream(dp)

  src
    .pipe(JSONStream.parse('*'))
    .pipe(es.mapSync(event => transformMessage(event)))
    .pipe(JSONStream.stringify())
    .pipe(dest)
}
