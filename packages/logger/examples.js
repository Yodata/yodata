#!/usr/local/bin node
var logger = require('.')
const basicobject = {
  type: 'test',
  name: 'bobo'
}
const message = 'my message'
logger.info('string value')
logger.info(basicobject)
logger.info({ ...basicobject, message: 'with a message' })
logger.info(message, { ...basicobject, description: 'message,data form' })
logger.info({ a: { b: { c: { d: { e: ['a', 'b', 'c'] } } } } })
