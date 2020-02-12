describe('normalize-content-type', () => {
  const normalize = require('./normalize-content-type')
  test('checks params', () => {
    expect(() => normalize(null)).toThrow()
    // @ts-ignore
    expect(() => normalize()).toThrow()
    // @ts-ignore
    expect(() => normalize(10)).toThrow()
  })

  test('returns a normalized valid content-type', () => {
    expect(normalize('yaml')).toEqual('application/x-yaml')
    expect(normalize('https://me.example.com/file.yml')).toEqual('application/x-yaml')
    expect(normalize('.jpg')).toEqual('image/jpeg')
    expect(normalize('image/ping')).toEqual('image/ping')
    expect(normalize('application/test')).toEqual('application/test')
  })
})
