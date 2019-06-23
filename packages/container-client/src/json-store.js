const Conf = require('conf')
const containerSchema = require('./container-schema')

/**
 * default container store
 *
 * @class ConfStore
 * @extends {Conf}
 */
class ContainerStore extends Conf {
  constructor (configName) {
    super({
      projectName: '@yodata/client',
      configName: configName,
      schema: containerSchema
    })
  }
}

module.exports = ContainerStore
