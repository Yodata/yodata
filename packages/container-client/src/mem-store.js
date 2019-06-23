const CacheBase = require('cache-base')
const containerSchema = require('./container-schema')

class ContainerStore extends CacheBase {
  constructor (name, value) {
    super('cache', value)
    this.name = name
  }
}

module.exports = ContainerStore
