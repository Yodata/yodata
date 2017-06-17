import Context from '../context'

describe(`context Class`, () => {
  let context = new Context({
    a: 'A',
    b: () => 'B',
    c: {
      key: 'c',
      val: () => 'C-VALUE',
    },
  })
  test(`has(key) - true if context maps the key or property`, () => {
    expect(context.has('a')).toBeTruthy()
    expect(context.has('d')).toBeFalsy()
  });
  test(`hasKey(key) - context handles the provided key`, () => {
    expect(context.hasKey('b')).toBeTruthy()
  });
  test(`hasVal(key) - context has a value handler`, () => {
    expect(context.hasVal('c')).toBeTruthy()
  });
  test(`mapKey(value)`, () => {
    expect(context.mapKey('a')).toEqual('A')
  });
  test(`mapKey(novalue) returns the passed value`, () => {
    expect(context.mapKey('nada')).toEqual('nada')
  });
  test(`mapVal(value)`, () => {
    expect(context.mapVal('b')).toEqual('B')
  });
  test(`empty context`, () => {
    let context = new Context()
    let data = {
      a: 1,
    }
    expect(context.map(data)).toEqual(data)

  });
  test(`extend context`, () => {
    let a = new Context({ a: 'b' })
    let b = a.extend({c:'d'})
    expect(b).toHaveProperty('cdef',{
      a:'b',
      c:'d'
    })
  });
})

describe(`simple syntax Context({'a':'b'})`, () => {
  test(`by default, keys and values pass through`, () => {
    let context = new Context()
    let data = {
      key: 1,
      foo: 'bar',
    }
    expect(context.map(data)).toEqual(data)
  });

  test(`maps keys`, () => {
    let context = new Context({ a: 'b' })
    let data = { a: 1 }
    let result = { b: 1 }
    expect(context.map(data)).toEqual(result)
  });

  test(`maps values`, () => {
    let context = new Context({ a: 'b' })
    let data = { c: 'a' }
    expect(context.map(data)).toEqual({ c: 'b' })
  });

  test(`map sets`, () => {
    let context = new Context({ a: 'b', c: 'c' });
    let data = { c: [ 'a', 'b', 'a' ] }
    expect(context.map(data)).toEqual({ c: [ 'b' ] })
  });

  test(`map set of objects`, () => {
    let data = {
      items: [
        {
          key: 1,
          name: 'one',
        },
        {
          key: 2,
          name: 'two',
        },
      ],
    }
    let context = new Context({
      key: 'id',
    })
    expect(context.map(data)).toEqual({
      items: [
        {
          id: 1,
          name: 'one',
        },
        {
          id: 2,
          name: 'two',
        },
      ],
    })

  });

  test(`deep mapping`, () => {
    let context = new Context({
      a: 'b.c',
    })
    let data = {
      a: 'foo',
      bar: 'a',
    }
    let result = {
      b: { c: 'foo' },
      bar: 'b.c',
    }
    expect(context.map(data)).toEqual(result)
  });

  test(`consolidate keys`, () => {
    let context = new Context({
      a: 'c',
      b: 'c',
    })
    let data = {
      a: 1,
      b: 2,
    }
    let result = {
      c: [ 1, 2 ],
    }
    expect(context.map(data)).toEqual(result)
  });
})

describe(`Advanced Syntax`, () => {

  test(`deep mapping - advanced syntax`, () => {
    let context = new Context({
      a: {
        key: 'b',
      },
    })
    // console.log({context})
    let data = {
      a: 'foo',
      bar: 'a',
    }
    let result = {
      b: 'foo',
      bar: 'a',
    }
    expect(context.map(data)).toEqual(result)
  });

})

describe('hiding data', () => {
  let context = new Context({
    a: null,
  })
  let data = {
    a: 'secret',
    b: 'a',
    c: [ 'a' ],
    d: {
      a: 'secret',
      e: 'a',
      f: [ 'a' ],
    },
  }
  let expected = {
    // a: 'secret',
    b: null,
    c: [ null ],
    d: {
      e: null,
      // a: 'secret'
      f: [ null ],
    },
  }
  let result = context.map(data);

  test(`hidden keys are removed`, () => {
    expect(result.a).toEqual(expected.a)
  });

  test(`values are replaced with null`, () => {
    expect(result.b).toEqual(expected.b)
  });

  test(`hidden values are removed from set results`, () => {
    expect(result.c).toEqual(expected.c)
  });

  test(`works with deep props and values`, () => {
    expect(result.d).toEqual(expected.d)
  });

})
