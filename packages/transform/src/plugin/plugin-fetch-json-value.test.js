/* eslint-disable no-undef */
const { Context, mapAsync } = require('..')
const plugin = require('./plugin-fetch-json-value')
const TOKEN = '$fetchjsonvalue'

test('looks up a value', async () => {
  const data = {
    a: '$fetchjsonvalue(https://ca301.bhhs.hsfaffiliates.com/profile/card,name,nonamefound)'
  }
  const ctx = new Context({}).use(plugin)
  return expect(mapAsync(ctx)(data)).resolves.toHaveProperty('a', 'California Properties')
})

test('works with a resolved context value', async () => {
  const data = {
    a: 'https://ca301.bhhs.hsfaffiliates.com/profile/card'
  }
  const cdef = {
    a: ({ value }) => `$fetchjsonvalue(${value},name,notfound)`
  }
  const ctx = new Context(cdef).use(plugin)
  return expect(mapAsync(ctx)(data)).resolves.toHaveProperty('a', 'California Properties')
})

test('has no impact if token is not found', async () => {
  const data = {
    a: 'https://ca301.bhhs.hsfaffiliates.com/profile/card'
  }
  const ctx = new Context({}).use(plugin)
  return expect(mapAsync(ctx)(data)).resolves.toMatchObject(data)
})
