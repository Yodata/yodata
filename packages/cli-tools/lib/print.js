const select = require('./select')
const formatResponse = require('./format-response')
const handleError = require('./handle-error')

exports.print = print
exports.info = print({ color: 'blue' })
exports.success = print({ color: 'green' })
exports.warning = print({ color: 'orange' })
exports.warn = print({ color: 'orange' })
exports.error = print({ color: 'red' })
exports.result = printResult
exports.command = (fn, selector) => {
  const handler = createResponseHandler(fn, selector)
  return args => handler(args)
    .then(printResult(args))
    .catch(handleError(args))
}

/**
 *
 * @param {object} [options] - print options
 * @returns {function} a print response handler
 */
function printResult (options) {
  /**
   * @param {any} value input
   * @returns {Promise<any>} result
   */
  return async function (value) {
    if (value instanceof Promise) {
      value = await value.catch(error => (error))
    }
    return Promise.resolve(value)
      .then(formatResponse(options))
      .then(console.log)
      .catch(handleError)
  }
}

/**
 * Print cli result.
 *
 * @param {object} options
 * @param {any} [value]
 * @returns {function|Promise} - print handler or result
 *
 */
function print (options, value) {
  if (arguments.length === 1) {
    return function (value) {
      return print(options, value)
    }
  }

  console.dir(formatResponse(options, value))
}

/**
 * Creates a cli response handler
 *
 * @param {function}        fn         - function to be called
 * @param {string|string[]} [selector] - if provided, fn called with selected property or properties
 * @returns {function}
 */
function createResponseHandler (fn, selector) {
  return async function (argv) {
    const props = selector ? select(selector, argv) : argv
    let result
    try {
      result = await fn(props)
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
