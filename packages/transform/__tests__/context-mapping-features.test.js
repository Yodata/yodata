// @ts-check

const { fromJS, Map } = require('immutable')
const Context = require('../src/context')
const { ADDITIONAL_PROPERTIES, VALUE, NEST, CONTAINER, LIST, SET, REDACT, REMOVE } = require('../src/terms')
const { defaultValues } = require('..')

const createContext = cdef => {
  const context = new Context()
  // @ts-ignore
  context.cdef = new Map(cdef)
  return context
}

describe('context.id - renames key', () => {
  test('renames key on map', () => {
    const cdef = { a: { id: 'b' } }
    const data = { a: 1 }
    const expected = { b: 1 }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test('renames sub-object keys', () => {
    const cdef = { a: { id: 'A' } }
    const data = { a: 1, b: { a: 1 } }
    const expected = { A: 1, b: { A: 1 } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test('renames array object keys', () => {
    const cdef = { a: { id: 'A' } }
    const data = [{ a: 1 }, { a: 2 }]
    const expected = [{ A: 1 }, { A: 2 }]
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test('renames keys on sub-object array values', () => {
    const cdef = { a: { id: 'A' } }
    const data = { b: [{ a: 1 }, { a: 2 }] }
    const expected = { b: [{ A: 1 }, { A: 2 }] }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test('combines primative values', () => {
    const cdef = { a: { id: 'C' }, b: { id: 'C' }, c: { id: 'C' } }
    const a = 1
    const b = Date.now()
    const c = 'string value'
    const data = { a, b, c }
    const expected = { C: [a, b, c] }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test('combines object values', () => {
    const cdef = { id: 'ID', a: 'C', b: 'C' }
    const data = { a: { id: 1 }, b: { id: 2 } }
    const expected = { C: [{ ID: 1 }, { ID: 2 }] }
    const context = new Context(cdef)
    expect(context.map(data)).toEqual(expected)
  })
})
describe('context.value {function}', () => {
  test('.value function is called with {value, key, object, context}', () => {
    const fn = jest.fn(props => props.value + 1)
    const cdef = {
      a: {
        value: fn
      }
    }
    const context = createContext(cdef)
    const object = { a: 1 }
    const expected = { a: 2 }
    const result = context.map(object)
    expect(fn).toHaveBeenCalledWith({ value: 1, key: 'a', object, context: cdef.a })
    expect(result).toEqual(expected)
  })
  test('.value function response replaces property value with new value', () => {
    const RETURN_VALUE = 'foo'
    const fn = () => RETURN_VALUE
    const cdef = { a: { value: fn } }
    const context = createContext(cdef)
    expect(context.map({ a: 1 })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ a: { id: 1, type: 'A' } })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ b: { a: 1 } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ a: [1, 2, 3] })).toEqual({ a: [RETURN_VALUE, RETURN_VALUE, RETURN_VALUE] })
    expect(context.map({ b: { c: { a: [1] } } })).toEqual({ b: { c: { a: [RETURN_VALUE] } } })
  })
  test('.value function returns value on error', () => {
    const fn = () => {
      throw new Error('error')
    }
    const cdef = { a: { value: fn } }
    const context = createContext(cdef)
    expect(context.map({ a: 1 })).toEqual({ a: 1 })
    expect(context.map({ a: { id: 1, type: 'A' } })).toEqual({ a: { id: 1, type: 'A' } })
    expect(context.map({ b: { a: 1 } })).toEqual({ b: { a: 1 } })
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: { id: 1 } } })
    expect(context.map({ a: [1, 2, 3] })).toEqual({ a: [1, 2, 3] })
    expect(context.map({ b: { c: { a: [1] } } })).toEqual({ b: { c: { a: [1] } } })
  })
})
describe('context.value {object}', () => {
  test('.value object replaces result', () => {
    const RETURN_VALUE = { id: 'a', type: 'B', name: 'a' }
    const cdef = { a: { [VALUE]: RETURN_VALUE } }
    const context = createContext(cdef)
    expect(context.map({ a: 1 })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ a: { id: 1, type: 'A' } })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ b: { a: 1 } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ a: [1, 2, 3] })).toEqual({ a: [RETURN_VALUE, RETURN_VALUE, RETURN_VALUE] })
    expect(context.map({ b: { c: { a: [1] } } })).toEqual({ b: { c: { a: [RETURN_VALUE] } } })
  })
  test('.value object #name & #value return key / value from data', () => {
    const name = 'a'
    const value = 1
    const cdef = { a: { [VALUE]: { n: '#name', v: '#value' } } }
    const expected = { a: { n: name, v: value } }
    const context = createContext(cdef)
    expect(context.map({ a: 1 })).toEqual(expected)
    expect(context.map({ a: { id: 1, type: 'A' } })).toEqual({ a: { n: 'a', v: { id: 1, type: 'A' } } })
    expect(context.map({ b: { a: 1 } })).toEqual({ b: expected })
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: { n: 'a', v: { id: 1 } } } })
  })
  test('.value object other #tokens are replaced from object value', () => {
    const data = {
      givenName: 'foo',
      a: {
        id: 1,
        givenName: 'bob'
      }
    }
    const cdef = {
      a: {
        value: {
          userName: '#givenName',
          data: '#value'
        }
      }
    }
    const expected = {
      a: {
        userName: 'bob',
        data: {
          id: 1,
          givenName: 'bob'
        }
      },
      givenName: 'foo'
    }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
})
describe('context.value {non-string primatives}', () => {
  test('.value dates', () => {
    const RETURN_VALUE = new Date()
    const cdef = { a: { value: RETURN_VALUE } }
    const context = createContext(cdef)
    expect(context.map({ a: 1 })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ a: { id: 1, type: 'A' } })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ b: { a: 1 } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ a: [1, 2, 3] })).toEqual({ a: [RETURN_VALUE, RETURN_VALUE, RETURN_VALUE] })
    expect(context.map({ b: { c: { a: [1] } } })).toEqual({ b: { c: { a: [RETURN_VALUE] } } })
  })
})
describe('context.value', () => {
  test('value:{string} acts like a $const', () => {
    const src = { a: 'b' }
    const cdef = { a: { value: 'a' } }
    expect(new Context(cdef).map(src)).toEqual({ a: 'a' })
  })
  test('.hash-string returns object[hash-string]', () => {
    const src = { a: 'b', c: 'd' }
    const cdef = { a: { value: '#c' } }
    const context = createContext(cdef)
    expect(context.map(src)).toEqual({ a: 'd', c: 'd' })
  })
})
describe('context.type', () => {
  test('adds type to object values', () => {
    const cdef = { a: { type: 'A' } }
    const data = { a: { id: 1 } }
    const expected = { a: { type: 'A', id: 1 } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: { type: 'A', id: 1 } } })
  })
  test('adds type & value to literal values', () => {
    const cdef = { a: { type: 'A' } }
    const data = { a: 1 }
    const expected = { a: { type: 'A', value: 1 } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
    expect(context.map({ a: 'test' })).toEqual({ a: { type: 'A', value: 'test' } })
  })
  test('not transitive - does not apply to sub-objects', () => {
    const cdef = { a: { type: 'A' } }
    const data = { a: { id: 1, b: { id: 2 } } }
    const expected = { a: { type: 'A', id: 1, b: { id: 2 } } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
  test('combine mutliple keys with type', () => {
    const cdef = {
      home: {
        id: 'telephone',
        type: 'ContactPoint',
        name: '#name'
      },
      mobile: {
        id: 'telephone',
        type: 'ContactPoint',
        name: '#name'
      }
    }
    const data = {
      home: 1,
      mobile: 2
    }
    const expected = {
      telephone: [
        { type: 'ContactPoint', telephone: 1, name: 'home' },
        { type: 'ContactPoint', telephone: 2, name: 'mobile' }
      ]
    }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
  test('type arrays are mapped to the context', () => {
    const cdef = {
      a: 'A'
    }
    const context = new Context(cdef)
    expect(context.map({ type: ['a', 'b'] })).toEqual({ type: ['A', 'b'] })
  })
  test('adds type to array values', () => {
    const type = 'A'
    const cdef = { a: { type } }
    const data = { a: [{ id: 1 }, { id: 2 }] }
    const expected = { a: [{ id: 1, type }, { id: 2, type }] }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
  test('add type to nested sub-property', () => {
    const type = 'A'
    const data = { a: { b: [{ id: 1 }, { id: 2 }] } }
    const expected = { a: [{ id: 1, type }, { id: 2, type }] }
    const cdef = {
      a: {
        value: '#b'
      },
      b: {
        type: 'A'
      }
    }

    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
})
describe('context.nest', () => {
  test('primative values', () => {
    const cdef = {
      a: {
        id: 'c',
        [NEST]: 'b'
      }
    }
    const data = { a: 1 }
    const expected = { b: { c: 1 } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
  test('object values', () => {
    const cdef = {
      a: {
        id: 'c',
        [NEST]: 'b'
      }
    }
    const data = { a: { id: 1 } }
    const expected = { b: { c: { id: 1 } } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
  test('merged object values', () => {
    const cdef = {
      a: {
        id: 'd',
        type: 'Thing',
        [NEST]: 'c'
      },
      b: {
        id: 'd',
        type: 'Thing',
        [NEST]: 'c'
      }
    }
    const data = { a: { name: 'a' }, b: { name: 'b' } }
    const expected = { c: { d: [{ name: 'a', type: 'Thing' }, { name: 'b', type: 'Thing' }] } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
})
describe('context.remove', () => {
  test('remove parsing', () => {
    const cdef = { a: null }
    const context = new Context(cdef)
    expect(context.get('a')).toEqual({
      id: 'a',
      name: 'a',
      [REMOVE]: true
    })
    expect(context.has(['a', REMOVE])).toBeTruthy()
    expect(context.isRemoved('a')).toBeTruthy()
    expect(context.isAllowed('a')).toBeFalsy()
  })
  test('remove context', () => {
    const cdef = {
      a: {
        [REMOVE]: true
      }
    }
    const context = createContext(cdef)
    expect(context.has(['a', REMOVE])).toBeTruthy()
    expect(context.isRemoved('a')).toBeTruthy()
    expect(context.isAllowed('a')).toBeFalsy()
    expect(context.map({ a: 1 })).toEqual({})
    expect(context.mapValue(1, 'a')).toEqual(REMOVE)
  })
})
describe('context.redact', () => {
  test('redact context', () => {
    const cdef = {
      a: {
        [REDACT]: true
      }
    }
    const context = createContext(cdef)
    expect(context.has(['a', REDACT])).toBeTruthy()
    expect(context.isRedacted('a')).toBeTruthy()
    expect(context.isAllowed('a')).toBeTruthy()
    expect(context.map({ a: 1 })).toEqual({ a: REDACT })
    expect(context.mapValue(1, 'a')).toEqual(REDACT)
  })
  test('redactText', () => {

  })
})
describe('context.container', () => {
  test('container = @List - repeat values are allowed', () => {
    const cdef = {
      b: 'a',
      c: 'a',
      a: {
        [CONTAINER]: LIST
      }
    }
    const data = {
      b: 1,
      c: 1
    }
    const expected = {
      a: [
        1,
        1
      ]
    }
    const context = new Context(cdef)
    const result = context.map(data)
    expect(result).toEqual(expected)
  })
  test('container = @Set - repeat values are not allowed', () => {
    const cdef = {
      b: 'a',
      c: 'a',
      a: {
        [CONTAINER]: SET
      }
    }
    const data = {
      b: 1,
      c: 1
    }
    const expected = {
      a: [
        1
      ]
    }
    const context = new Context(cdef)
    const result = context.map(data)
    expect(result).toEqual(expected)
  })
  test('container = @Set - single values are always an array', () => {
    const cdef = {
      a: { '@container': '@set' }
    }
    const data = {
      a: 1
    }
    const expected = {
      a: [
        1
      ]
    }
    const context = new Context(cdef)
    const result = context.map(data)
    expect(result).toEqual(expected)
  })
})
describe('context.context - sub-context over-rides current-context', () => {
  test('map object with sub-context', () => {
    const data = fromJS({ a: { a: 1 } })
    const expected = fromJS({ A: { B: 1 } })
    const context = new Context({
      a: {
        id: 'A',
        '@context': {
          a: 'B'
        }
      }
    })
    expect(context.map(data.toJS())).toEqual(expected.toJS())
  })
})
describe('context.additionalProperties', () => {
  test('allowsAdditionalProperties are allowed by default', () => {
    const context = new Context()
    expect(context.allowsAdditionalProperties).toBeTruthy()
  })
  test('additional properties are removed from results when allowsAdditionalProperties is not set or false', () => {
    const context = new Context({ a: 'a' }).setOption(ADDITIONAL_PROPERTIES, false)
    expect(context.allowsAdditionalProperties).toBeFalsy()
  })
})
describe('context.map', () => {
  test('context.map supports array of objects', () => {
    const context = new Context({ a: 'b' })
    const data = [{ a: 1 }]
    expect(context.map(data)).toEqual([{ b: 1 }])
  })
  test('supports type arrays, i.e. type: [type1, type2] ', () => {
    const data = { type: ['Agent', 'Owner'] }
    const expected = { type: ['RealEstateAgent', 'Owner'] }
    const cdef = {
      Agent: {
        id: 'RealEstateAgent'
      }
    }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
  test('map can merge multiple key.object values into an array of objects under a single key', () => {
    const data = {
      objA: { '@id': 1, name: 'alice' },
      objB: { '@id': 2, name: 'dave' },
      listA: [{ '@id': 3 }, { '@id': 4 }]
    }
    const context = new Context({
      '@id': {
        id: 'id'
      },
      objA: 'list',
      objB: 'list'
    })
    return expect(context.map(data)).toEqual({
      list: [{ id: 1, name: 'alice' }, { id: 2, name: 'dave' }],
      listA: [{ id: 3 }, { id: 4 }]
    })
  })
  test('convert {name:value} to {key: {name:value}}', () => {
    const data = {
      internalId: 1
    }
    const expected = {
      internalId: {
        name: 'internalId',
        value: 1
      }

    }
    const cdef = {
      internalId: {
        value: {
          name: '#name',
          value: '#value'
        }
      }
    }
    const context = new Context(cdef)
    expect(context.map(data)).toEqual(expected)
  })
  test('can combine multiple keys into a sub-object', () => {
    const data = {
      id1: 1,
      id2: 2,
      name1: 'a',
      name2: 'b'
    }
    const expected = {
      group: [
        {
          id: 1,
          name: 'a'
        },
        {
          id: 2,
          name: 'b'
        }
      ]

    }
    const context = new Context({
      id1: 'group.0.id',
      id2: 'group.1.id',
      name1: 'group.0.name',
      name2: 'group.1.name'
    })
    expect(context.map(data)).toEqual(expected)
  })
})
test('add object default values', () => {
  const data = { MobilePhone: '867-5309' }
  const cdef = {
    MobilePhone: {
      id: 'telephone',
      type: 'ContactPoint',
      name: '#name'
    }
  }
  const expected = {
    telephone: {
      type: 'ContactPoint',
      name: 'MobilePhone',
      telephone: '867-5309'
    }
  }
  const context = createContext(cdef)
  expect(context.map(data)).toEqual(expected)
})
test('maps type/@type values to context @ids', () => {
  const cdef = {
    a: {
      id: 'A'
    }
  }
  const context = createContext(cdef)
  const data = {
    type: 'a'
  }
  const expected = {
    type: 'A'
  }
  expect(context.map(data)).toEqual(expected)
})
test('deep merge', () => {
  const context = new Context({ a: 'out.a', b: 'out.b' })
  const data = { a: 1, b: 2 }
  return expect(context.map(data)).toEqual({ out: { a: 1, b: 2 } })
})
test('deep properties are merged with existing properties', () => {
  const context = new Context({ a: 'out.a', b: 'out.b', outType: 'out.type' })
  const data = { a: 1, b: 2, outType: 'test' }
  return expect(context.map(data)).toEqual({
    out: { type: 'test', a: 1, b: 2 }
  })
})
test('deep mapping - advanced syntax', () => {
  const context = new Context({ a: 'b' })
  const data = {
    a: 'a',
    c: {
      a: 'b.a',
      d: {
        a: 'b.c.a'
      }
    }
  }
  expect(context.map(data)).toEqual({
    b: 'a',
    c: {
      b: 'b.a',
      d: {
        b: 'b.c.a'
      }
    }
  })
})

test('supports URI keys', () => {
  const id = 'http://example.com/'
  const context = new Context({ a: 'b' })
  const data = {
    [id]: {
      a: 1
    }
  }
  const result = context.map(data)
  expect(result).toEqual({
    [id]: {
      b: 1
    }
  })
})

test('supports jsonata.expressions', () => {
  const data = {
    source: {
      target: 'you got me'
    }
  }
  const context = new Context({
    source: {
      id: 'result',
      value: '(target)'
    }
  })
  expect(context.map(data)).toEqual({
    result: 'you got me'
  })
})

test('object values supports jsonata.expressions', () => {
  const data = {
    source: {
      type: 'Thing',
      fn: 'king',
      ln: 'kong'
    }
  }
  const context = new Context({
    source: {
      id: 'result',
      value: {
        type: '#type',
        name: '(fn & " " & ln)'
      }
    }
  })
  expect(context.map(data)).toEqual({
    result: {
      type: 'Thing',
      name: 'king kong'
    }
  })
})
