const CacheBase = require('cache-base')

class ContainerStore extends CacheBase {
  constructor (name, value) {
    super('cache', value)
    this.name = name
  }
}

module.exports = ContainerStore
