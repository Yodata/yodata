'use strict'
const fs = require('fs')
const { loadContext, plugin } = require('@yodata/transform')
const transformPluginView = require('@yodata/transform-plugin-view')
const JSONStream = require('JSONStream')
const Path = require('path')
const assert = require('assert-plus')
const MAX_ITEMS = 1000
const log = require('./logger')
const es = require('event-stream')

module.exports = (contextPath, sourcepath, targetpath) => {
  assert.string(contextPath, 'context path')
  assert.string(sourcepath, 'sourcepath')
  assert.optionalString(targetpath, 'target path')
  let iterations = 0
  let errors = 0

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

  const nextPath = (i) => {
    const suffix = (i < 10) ? `.0${i}` : `.${i}`
    return Path.resolve(source.name + suffix + source.ext)
  }

  const src = fs.createReadStream(pathOf.source)
  let target = JSONStream.stringify()
  let source = Path.parse(pathOf.source)
  let destpath = Path.resolve(source.name + '.out' + source.ext)
  let dest = fs.createWriteStream(destpath)
  target.pipe(dest)

  function eventHandler () {
    let index = 0
    let docIndex = 0
    const maxItems = MAX_ITEMS
    let destpath = nextPath(docIndex)
    let dest = fs.createWriteStream(destpath)
    target.pipe(dest)

    return event => {
      if (index > maxItems) {
        docIndex++
        index = 0

        // target.end()
        dest.write('\n]')
        dest.end()

        destpath = nextPath(docIndex)
        dest = fs.createWriteStream(destpath)
        target = JSONStream.stringify()
        target.pipe(dest)
      }
      target.write(event)
      index++
      console.count(`${source.name}:${docIndex}`)
    }
  }

  const transformMessage = (message) => {
    try {
      const { id } = message
      const type = message[ 'data.type' ]
      const object = JSON.parse(message[ 'data.object' ])
      delete message[ 'data.type' ]
      delete message[ 'data.object' ]
      message.data = { type, object }
      log.info(`${pathOf.source}:${id}`)
      return context.map(message)
    } catch (error) {
      log.error(`${error.message}:id:${message.id}`)
      return null
    }
  }

  src
    .pipe(JSONStream.parse('*'))
    .pipe(es.mapSync(event => transformMessage(event)))
    .pipe(JSONStream.stringify())
    .pipe(dest)
}
