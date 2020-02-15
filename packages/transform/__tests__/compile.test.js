const {compile} = require('..')

describe('compile', () => {
  test('from yaml file', () => {
    const target = '../examples/context-definition.yaml'
    return expect(compile(target)).resolves.toBeInstanceOf(Function)
  })
})
