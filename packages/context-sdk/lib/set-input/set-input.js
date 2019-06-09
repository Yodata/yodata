const read = require('read-data')
const getContextInfo = require('../info/get-context-info')

module.exports = config => async function (filepath) {
  // @ts-ignore
  const data = read.sync(filepath)
  const ctx = await getContextInfo()
}
