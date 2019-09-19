const { Context, mapAsync } = require('..')
test('map-async', async () => {
  const fn = async () => 'foo'
  const context = new Context({
    test: fn
  })
  const data = {
    test: ''
  }
  return expect(mapAsync(context)(data)).resolves.toMatchObject({ test: 'foo' })
})

test('map-async.deep values', async () => {
  const fn = async () => 'foo'
  const context = new Context({})
  const data = {
    a: {
      b: fn(),
      c: {
        d: fn()
      }
    }
  }
  return expect(mapAsync(context)(data)).resolves.toHaveProperty('a.b', 'foo')
})
