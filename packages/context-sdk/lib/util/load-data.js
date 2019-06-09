const mld = require('my-load-data')

module.exports = loadData

async function loadData (datapath) {
  const data = await mld.fromFile(datapath)
  return data
}
