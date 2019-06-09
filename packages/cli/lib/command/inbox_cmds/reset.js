const assert = require('assert-plus')
const { profile } = require('@yodata/config')
const { inbox } = require('@yodata/client')

exports.command = 'reset'
exports.description = 'Reset your inbox cache'
exports.builder = {
  last: {
    type: 'boolean',
    default: false,
    group: 'reset',
    desc: 'Removes inbox cache for the current page (forcing your next inbox ls to reload from the source)'
  },
  cache: {
    type: 'boolean',
    default: false,
    group: 'reset',
    desc: 'Clears all cached values'
  },
  all: {
    type: 'boolean',
    default: false,
    group: 'reset',
    desc: 'Removes all settings and clears all cached data'
  }
}
exports.handler = function (argv) {
  const { last, cache, all } = argv
  const profileName = profile.name()

  if (last === true) {
    const lastv = profile.get('inbox.last')
    if (typeof lastv === 'string' && lastv.length > 0) {
      profile.delete(`cache.${lastv}`)
    }
  }

  if (cache === true) {
    profile.delete('cache')
    console.log(`${profileName} cache deleted.`)
  }

  if (all === true) {
    const lastv = profile.get('inbox.last')

    if (typeof lastv === 'string' && lastv.length > 0) {
      profile.delete(`cache.${lastv}`)
      console.log(`${profileName} inbox.last deleted`)
    }

    profile.delete('cache')
    console.log(`${profileName} cache deleted.`)
  }
}
