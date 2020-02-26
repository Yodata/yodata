/* eslint-disable no-undef */
/** @format */

describe('info', () => {
  const getinfo = require('../lib/info')
  test('info.defaults', async () => {
    expect.assertions(9)
    const info = await getinfo()
    expect(info).toHaveProperty('contentType', expect.any(String))
    expect(info).toHaveProperty('description', expect.any(String))
    expect(info).toHaveProperty('environment', expect.any(String))
    expect(info).toHaveProperty('hostkey', expect.any(String))
    expect(info).toHaveProperty('hostname', expect.any(String))
    expect(info).toHaveProperty('name', expect.any(String))
    expect(info).toHaveProperty('origin', expect.any(String))
    expect(info).toHaveProperty('url', expect.any(String))
    expect(info).toHaveProperty('version', expect.any(String))
  })

  test('info.environment', async () => {
    const info = await getinfo()
    expect(info).toHaveProperty('environment', 'stage')
    expect(info).toHaveProperty('hostkey', 'secret')
    expect(info).toHaveProperty('hostname', 'https://example.com')
    expect(info).toHaveProperty('name', '')
    expect(info).toHaveProperty('version', '1')
  })
})
