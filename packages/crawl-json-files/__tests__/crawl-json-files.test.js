
/** @format */

'use strict'

const { crawlJsonFiles } = require('../lib')

const TARGET_DIRECTORY = './__test_data__'

const reducer = (result = {}, value, key, base) => {
  result[key] === value
  return result
}

describe('@yodata/crawl-json-files', () => {
  test('response', async () => {
    expect.assertions(4)
    const result = await crawlJsonFiles(TARGET_DIRECTORY, reducer )
    expect(result).toBeInstanceOf(Object)
    // expect(result).toHaveProperty('source', TARGET_DIRECTORY)
    expect(result).toHaveProperty('count', 3)
    return expect(result).toHaveProperty('keys', ['a', 'b', 'c', 'd', 'id', 'x', 'x.y'])
  })
})
