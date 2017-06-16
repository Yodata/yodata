import parseContext from '../parseContext'
import Context from '../context'
import { KEYMAP, VALMAP } from '../constants'

describe(`context api`, () => {

  test(`simple syntax a = b => replace a with b in keys and values`, () => {
    const context = new Context({ a: 'b' })
    expect(context[ KEYMAP ]).toHaveProperty('a', 'b')
    expect(context.mapKey('a')).toEqual('b')
    expect(context.map({ a: 1 })).toEqual({ b: 1 })
    expect(context.map({ b: 'a' })).toEqual({ b: 'b' })
  });

  test(`function syntax a = (fn, deps) => dest.a = 1`, () => {
    let context = parseContext({
      key: 'key',
      nextKey: ({ last }) => last.key + 1,
    })
    expect(context[ KEYMAP ]).toHaveProperty('nextKey', 'nextKey')
    expect(context[ VALMAP ]).toHaveProperty('nextKey')
  });

  test(`advanced syntax`, () => {
    let context = parseContext({
      a: {
        key: 'b',
        val: 'c',
      },
    })
    expect(context[ KEYMAP ]).toHaveProperty('a', 'b')
    expect(context[ VALMAP ]).toHaveProperty('a', 'c')
  });

  test(`malformed context error`, () => {
    expect(() => parseContext({ 1: 2 })).toThrow(`Unable to process context`)
  });
})
