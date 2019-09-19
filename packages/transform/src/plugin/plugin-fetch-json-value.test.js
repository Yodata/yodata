/* eslint-disable no-undef */
const { Context, mapAsync } = require('..')
const plugin = require('./plugin-fetch-json-value')

test('looks up a value', async () => {
  const data = {
    a: '$fetchjsonvalue(https://ca301.bhhs.hsfaffiliates.com/profile/card,name,nonamefound)'
  }
  const ctx = new Context({}).use(plugin)
  const result = await mapAsync(ctx)(data)
  return expect(result).toHaveProperty('a', 'California Properties')
})

test('works in a nested value', async () => {
  const data = {
    a: {
      b: 'ca301'
    },
    c: 'ca301'
  }
  const ctx = new Context({
    b: ({ value }) => `$fetchjsonvalue(https://${value}.bhhs.hsfaffiliates.com/profile/card,name,${value})`
  }).use(plugin)
  return expect(mapAsync(ctx)(data)).resolves.toHaveProperty('a.b', 'California Properties')
})

test('works in with muliple values', async () => {
  const data = {
    a: '$fetchjsonvalue(https://ca301.bhhs.hsfaffiliates.com/profile/card,name,nonamefound)',
    b: '$fetchjsonvalue(https://ca301.bhhs.hsfaffiliates.com/profile/card,name,nonamefound)'
  }
  const ctx = new Context({}).use(plugin)
  const result = await mapAsync(ctx)(data)
  expect(result).toHaveProperty('a', 'California Properties')
  return expect(result).toHaveProperty('b', 'California Properties')
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

test('works in yaml', async () => {
  const data = {
    a: 'https://ca301.bhhs.hsfaffiliates.com/profile/card'
  }
  const cdef = `
  a:
    id: b
    value: !!js/function |
      async function(props) {
        const {value} = props
        return "$fetchjsonvalue(" + value + ",name,ohshit)"
      }
  `
  const ctx = Context.fromYaml(cdef).use(plugin)
  return expect(mapAsync(ctx)(data)).resolves.toHaveProperty('b', 'California Properties')
})

test('returns provided defaultValue on error', async () => {
  const data = {
    a: 'https://example.com'
  }
  const cdef = `
  a:
    id: b
    value: !!js/function |
      async function(props) {
        const {value} = props
        return "$fetchjsonvalue(" + value + ",name,ohshit)"
      }
  `
  const ctx = Context.fromYaml(cdef).use(plugin)
  return expect(mapAsync(ctx)(data)).resolves.toHaveProperty('b', 'ohshit')
})

test('returns error message if no default is provided', async () => {
  const data = {
    a: 'badaddress'
  }
  const cdef = `
  a:
    id: b
    value: !!js/function |
      async function(props) {
        const {value} = props
        return "$fetchjsonvalue(" + value + ",name)"
      }
  `
  const ctx = Context.fromYaml(cdef).use(plugin)
  const result = await mapAsync(ctx)(data)
  expect(result).toHaveProperty('b', 'Only absolute URLs are supported')
})
