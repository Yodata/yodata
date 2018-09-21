const Store = require('./store')
const path = require('path')

test('store.import', async () => {
  let store = new Store()
  let filePath = path.resolve('../rdf.ttl')
  store = await store.importFile(filePath)
  expect(store.size).toBeGreaterThan(0)
})
