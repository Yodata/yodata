/** @format */
const hasvalue = require('../util/has-value')
const getvalue = require('../util/get-value')

module.exports = options => function (error) {
  console.log('before.error', this)
  if (hasvalue(error, 'gotOptions.context.defaultValue')) {
    console.info('DEFAULT_VALUE_FOUND')
    error.defaultValue = getvalue(error, 'gotOptions.context.defaultValue')
  } else {
    console.log(`options: ${JSON.stringify(options)}`)
    console.log(`gotOptions: ${JSON.stringify(error)}`)
    error.message = 'before.error.error'
    error.statusCode = 200
  }
  return error
}
