const { table, getBorderCharacters } = require('table')
const kindOf = require('kind-of')
const pick = require('lodash/pick')
const castArray = require('lodash/castArray')
const assert = require('assert-plus')

const TABLE_OPTIONS = {
  border: getBorderCharacters('void'),
  columnDefault: {
    paddingLeft: 2,
    paddingRight: 2
  },
  drawHorizontalLine: () => {
    return false
  }
}

exports.getColumns = getColumns
exports.getRows = getRows
exports.objectToTable = objectToTable
exports.fromObject = objectToTable
exports.tableize = tableize
exports.toTable = toTable

function tableize (options, items) {
  if (arguments.length === 1) {
    return data => tableize(options, data)
  }

  const keys = options.keys || Object.keys(items[0])
  const result = []
  items.forEach(item => {
    const instance = []
    keys.forEach(key => {
      instance.push(item[key])
    })
    result.push(instance)
  })
  result.unshift(keys)
  return result
}

/**
 *
 * @param {object|string|string[]} options - keys to select (default will use all keys of object or first item in an array)
 * @param {object|object[]} data - data to be proccesed
 * @returns {array[]}
 *
 */
function objectToTable (options, data) {
  if (arguments.length === 1) {
    return data => objectToTable(options, data)
  }

  const columns = getColumns(options, data)
  const rows = getRows(columns, data)
  rows.unshift(columns)
  return rows
}

/**
 *
 * @param {string|string[]} keys - options
 * @param {object|object[]} data
 * @param {number} [index]
 * @returns {array[]} data as an array of string values (rows)
 */
function getRows (keys, data, index) {
  switch (kindOf(data)) {
    case 'array': {
      return data.map((value, index) => getRows(keys, value, index))
    }

    case 'object': {
      Object.assign(data, { index })
      return Object.values(pick(data, keys))
    }

    default:
      throw new TypeError(`unexpected type: ${kindOf(data)}`)
  }
}

/**
 *
 * @param {object|string|string[]} options - options (with keys)
 * @param {object} data - data object to sample
 * @returns {string[]} columns (array of strings)
 */
function getColumns (options, data) {
  if (kindOf(options) === 'object' && (options.keys || options.columns)) {
    return castArray(options.keys || options.columns)
  }

  if (kindOf(options) === 'string') {
    return [options]
  }

  if (kindOf(options) === 'array') {
    assert.arrayOfString(options)
    return options
  }

  // Calculate columns from data
  switch (kindOf(data)) {
    case 'object':
      return Object.keys(data)
    case 'array': {
      if (data.length === 0) {
        throw new Error('get.columns.error:no.data')
      } else {
        if (kindOf(data[0]) === 'object') {
          return Object.keys(data[0])
        }

        return ['index']
      }
    }

    default:
      throw new Error(`get.columns.error:cannot calculate column names from ${kindOf(data)}`)
  }
}

/**
 *
 * @param {object} options
 * @param {any} [value]
 * @returns {function|*}
 */
function toTable (options, value) {
  if (arguments.length === 1) {
    return value => toTable(options, value)
  }

  const data = objectToTable(options, value)
  console.log(table(data, TABLE_OPTIONS))
}
