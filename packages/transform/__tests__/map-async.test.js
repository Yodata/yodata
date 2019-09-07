
test('map-async', async () => {
  const { Context, mapAsync } = require('..')
  const fn = async () => 'foo'
  const context = new Context({
    test: fn
  })
  const data = {
    test: ''
  }
  const result = await mapAsync(context)(data)
  return expect(result).toMatchObject({ test: 'foo' })
})
