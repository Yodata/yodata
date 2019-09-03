
const fs = require('fs-plus')
const assert = require('assert-plus')
const kindOf = require('kind-of')
const get = require('lodash/get')

const DEFAULT_CONFIG = {
  indexKeys: true,
  indexValues: [],
  domainidentifier: '@type',
  mock: true,
  onfile: () => { },
  filter: () => true
}

module.exports = userConfig => {
  const config = Object.assign({}, DEFAULT_CONFIG, userConfig)

  const initialValues = {
    source: config.source,
    count: 0,
    errors: [],
    keys: new Set(),
    events: [],
    index: new Map(),
    range: []
  }

  return function (data, filepath, index) {
    assert.string(filepath)

    if (typeof data === 'string') {
      data = initialValues
    }

    if (typeof filepath !== 'string') {
      console.error('filepath undefined')
      return data
    }

    if (!filepath.endsWith('.json')) {
      console.warn(`skipped (no-json): ${filepath}`)
      data.errors.push(filepath)
      return data
    }

    try {
      const json = JSON.parse(fs.readFileSync(filepath, 'utf8'))

      if (!config.filter(json)) {
        return data
      }

      const eventType = get(json, config.domainidentifier)

      if (!data.events.includes(eventType)) {
        data.events.push(eventType)
      }

      /** Walk properties of the current object */
      Object.entries(json).forEach(([ key, val ]) => {
        // Update the keys set
        data.keys.add(key)

        const model = data.index.get(key) || addToIndex(key, val)
        const range = kindOf(val)

        model.count++

        if (!model.range.includes(range)) {
          model.range.push(range)
        }

        if (model.trackValues) {
          // Add to value index
          model.values.add(val)
        }

        if (!model.events.includes(eventType)) {
          model.events.push(eventType)
        }
      })

      data.count++
      if (config.onfile) {
        config.onfile(index)
      }

      return data
    } catch (error) {
      console.error(`error: ${filepath} - ${error.message}`)
      data.errors.push(filepath)
      return data
    }

    function addToIndex (key, val) {
      const isIndexed = config.indexValues.includes(key)
      const model = {
        name: key,
        count: 0,
        example: val,
        isIndexed,
        trackValues: isIndexed,
        values: isIndexed ? new Set().add(val) : undefined,
        events: [],
        range: []
      }
      data.index.set(key, model)
      return model
    }
  }
}
