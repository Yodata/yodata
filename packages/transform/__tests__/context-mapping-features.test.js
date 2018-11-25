const Context = require("../src/context")
const { fromJS, Map } = require("immutable")
const { ID, ADDITIONAL_PROPERTIES, NAME, VALUE, NEST } = require("../src/terms")

const createContext = (cdef) => {
  let context = new Context()
  context.cdef = Map(cdef)
  return context
}

describe("context.id - maps key values", () => {

  test("renames key on map", () => {
    const cdef = { a: { id: "b" } }
    const data = { a: 1 }
    const expected = { b: 1 }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("renames sub-object keys", () => {
    const cdef = { a: { id: "A" } }
    const data = { a: 1, b: { a: 1 } }
    const expected = { A: 1, b: { A: 1 } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("renames array object keys", () => {
    const cdef = { a: { id: "A" } }
    const data = [{ a: 1 }, { a: 2 }]
    const expected = [{ A: 1 }, { A: 2 }]
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("renames keys on sub-object array values", () => {
    const cdef = { a: { id: "A" } }
    const data = { b: [{ a: 1 }, { a: 2 }] }
    const expected = { b: [{ A: 1 }, { A: 2 }] }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("combines primative values", () => {
    const cdef = { a: { id: "C" }, b: { id: "C" }, c: { id: "C" } }
    let a = 1
    let b = Date.now()
    let c = "string value"
    const data = { a, b, c }
    const expected = { C: [a, b, c] }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("combines object values", () => {
    const cdef = { id: "ID", a: "C", b: "C" }
    const data = { a: { id: 1 }, b: { id: 2 } }
    const expected = { C: [{ ID: 1 }, { ID: 2 }] }
    const context = new Context(cdef)
    expect(context.map(data)).toEqual(expected)
  })

})

describe("context.value {function}", () => {
  test(".value function is called with {value, key, object, context}", () => {
    let fn = jest.fn(props => props.value + 1)
    let cdef = {
      a: {
        value: fn
      }
    }
    let context = createContext(cdef)
    let object = { a: 1 }
    let expected = { a: 2 }
    let result = context.map(object)
    expect(fn).toHaveBeenCalledWith({ value: 1, key: "a", object, context: cdef.a })
    expect(result).toEqual(expected)
  })
  test(".value function response replaces property value with new value", () => {
    const RETURN_VALUE = "foo"
    const fn = () => RETURN_VALUE
    const cdef = { a: { value: fn } }
    const context = createContext(cdef)
    expect(context.map({ a: 1 })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ a: { id: 1, type: "A" } })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ b: { a: 1 } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ a: [1, 2, 3] })).toEqual({ a: [RETURN_VALUE, RETURN_VALUE, RETURN_VALUE] })
    expect(context.map({ b: { c: { a: [1] } } })).toEqual({ b: { c: { a: [RETURN_VALUE] } } })
  })
})

describe("context.value {object}", () => {
  test(".value object replaces result", () => {
    const RETURN_VALUE = { id: "a", type: "B", name: "a" }
    const cdef = { a: { value: RETURN_VALUE } }
    const context = createContext(cdef)
    expect(context.map({ a: 1 })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ a: { id: 1, type: "A" } })).toEqual({ a: RETURN_VALUE })
    expect(context.map({ b: { a: 1 } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: RETURN_VALUE } })
    expect(context.map({ a: [1, 2, 3] })).toEqual({ a: [RETURN_VALUE, RETURN_VALUE, RETURN_VALUE] })
    expect(context.map({ b: { c: { a: [1] } } })).toEqual({ b: { c: { a: [RETURN_VALUE] } } })
  })
  test(".value object token values #token are replaced from context", () => {
    const name = "a"
    const value = 1
    const cdef = { a: { value: { name: "#name", value: "#value" } } }
    const expected = { a: { name, value } }
    const context = createContext(cdef)
    expect(context.map({ a: 1 })).toEqual(expected)
    expect(context.map({ a: { id: 1, type: "A" } })).toEqual({ a: { name: "a", value: { id: 1, type: "A" } } })
    expect(context.map({ b: { a: 1 } })).toEqual({ b: expected })
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: { name, value: { id: 1 } } } })
  })
  test(".value object hashTokens are replaced from object value", () => {
    const data = {
      user: {
        type:      "Person",
        givenName: "Dave",
        age:       52
      }
    }
    const cdef = {
      user: {
        value: {
          type:     "#type",
          yearsOld: "#age"
        }
      }
    }
    const expected = {
      user: {
        type:     "Person",
        yearsOld: 52
      }
    }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
})

describe("context.type - creates entities", () => {

  test("adds type to object values", () => {
    const cdef = { a: { type: "A" } }
    const data = { a: { id: 1 } }
    const expected = { a: { type: "A", id: 1 } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
    expect(context.map({ b: { a: { id: 1 } } })).toEqual({ b: { a: { type: "A", id: 1 } } })
  })

  test("adds type & value to literal values", () => {
    const cdef = { a: { type: "A" } }
    const data = { a: 1 }
    const expected = { a: { type: "A", value: 1 } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("not transitive - does not apply to sub-objects", () => {
    const cdef = { a: { type: "A" } }
    const data = { a: { id: 1, b: { id: 2 } } }
    const expected = { a: { type: "A", id: 1, b: { id: 2 } } }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("combine mutliple keys with type", () => {
    const cdef = {
      home:   {
        id:   "telephone",
        type: "ContactPoint",
      },
      mobile: {
        id:   "telephone",
        type: "ContactPoint",
      }
    }
    const data = {
      home:   1,
      mobile: 2
    }
    const expected = {
      telephone: [
        { type: "ContactPoint", telephone: 1 },
        { type: "ContactPoint", telephone: 2 }
      ]
    }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)

  })
})

describe("context.container", () => {

  test("primative values", () => {
    let cdef = {
      a: {
        id:        "c",
        container: "b"
      }
    }
    let data = { a: 1 }
    let expected = { b: { c: 1 } }
    let context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("object values", () => {
    let cdef = {
      a: {
        id:        "c",
        container: "b"
      }
    }
    let data = { a: { id: 1 } }
    let expected = { b: { c: { id: 1 } } }
    let context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("merged object values", () => {
    let cdef = {
      a: {
        id:        "d",
        type:      "Thing",
        container: "c"
      },
      b: {
        id:        "d",
        type:      "Thing",
        container: "c"
      }
    }
    let data = { a: { name: "a" }, b: { name: "b" } }
    let expected = { "c": { "d": [{ "name": "a", "type": "Thing" }, { "name": "b", "type": "Thing" }] } }
    let context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })
})

describe("context.context - sub-context over-rides current-context", () => {
  test("map object with sub-context", () => {
    const data = fromJS({ a: { a: 1 } })
    const expected = fromJS({ A: { B: 1 } })
    const context = new Context({
      a: {
        id:         "A",
        "@context": {
          a: "B"
        }
      }
    })
    expect(context.map(data.toJS())).toEqual(expected.toJS())
  })
})

describe("ADDITIONAL_PROPERTIES", () => {
  test("additionalProperties are allowed by default", () => {
    const context = new Context()
    expect(context.getOption(ADDITIONAL_PROPERTIES)).toBe(true)
    // expect(context.map({ a: "a" })).toEqual({ a: "a" })
  })

  test("additional properties are removed from results when additionalProperties is not set or false", () => {
    const context = new Context({ a: "a" }).setOption(ADDITIONAL_PROPERTIES, false)
    expect(context.getOption(ADDITIONAL_PROPERTIES)).toBe(false)
    expect(context.map({ a: 1, b: 1 })).toEqual({ a: 1 })
  })
})

describe("handles set values", () => {

  test("map(array)", () => {
    const context = new Context({ a: "b" })
    const data = [{ a: 1 }]
    expect(context.map(data)).toEqual([{ b: 1 }])
  })

  test("map.array.value", () => {
    const data = { firstName: ["david", "dave"] }
    const expectedResult = { givenName: ["david", "dave"] }
    const context = new Context({ firstName: "givenName" })
    expect(context.map(data)).toEqual(expectedResult)
  })

  test("type array", () => {
    const data = { type: ["Agent", "Owner"] }
    const expected = { type: ["RealEstateAgent", "Owner"] }
    const cdef = {
      Agent: {
        id: "RealEstateAgent"
      }
    }
    const context = createContext(cdef)
    expect(context.map(data)).toEqual(expected)
  })

  test("map set of objects", () => {
    const context = new Context({
      key: "id"
    })
    const data = {
      items: [
        {
          key:  1,
          name: "one"
        },
        {
          key:  2,
          name: "two"
        }
      ]
    }
    expect(context.map(data)).toEqual({
      items: [
        {
          id:   1,
          name: "one"
        },
        {
          id:   2,
          name: "two"
        }
      ]
    })
  })

  test("set of IDs", () => {
    const data = {
      type: "A",
      name: "Dave"
    }
    const expected = {
      type: "B",
      name: "Dave"
    }
    const context = new Context({
      A: "B"
    })
    expect(context.map(data)).toEqual(expected)
  })
})

describe("map object values", () => {
  test("merge object values", () => {
    let data = {
      objA:  { "@id": 1, name: "alice" },
      objB:  { "@id": 2, name: "dave" },
      listA: [{ "@id": 3 }, { "@id": 4 }]
    }
    let context = new Context({
      "@id": {
        id: "id"
      },
      objA:  "list",
      objB:  "list"
    })
    return expect(context.map(data)).toEqual({
      list:  [{ id: 1, name: "alice" }, { id: 2, name: "dave" }],
      listA: [{ id: 3 }, { id: 4 }]
    })
  })
})

test("add object default values", () => {
  const data = { MobilePhone: "867-5309" }
  const cdef = {
    MobilePhone: {
      id:    "telephone",
      type:  "ContactPoint",
      name: '#name',
    }
  }
  const expected = {
    telephone: {
      type:      "ContactPoint",
      name:      "MobilePhone",
      telephone: "867-5309"
    }
  }
  const context = createContext(cdef)
  expect(context.map(data)).toEqual(expected)
})

test("maps type/@type values to context @ids", () => {
  let cdef = {
    a: {
      id: "A"
    }
  }
  let context = createContext(cdef)
  let data = {
    type: "a"
  }
  let expected = {
    type: "A"
  }
  expect(context.map(data)).toEqual(expected)
})

test("deep merge", () => {
  const context = new Context({ a: "out.a", b: "out.b" })
  const data = { a: 1, b: 2 }
  return expect(context.map(data)).toEqual({ out: { a: 1, b: 2 } })
})
test("deep properties are merged with existing properties", () => {
  const context = new Context({ a: "out.a", b: "out.b", outType: "out.type" })
  const data = { a: 1, b: 2, outType: "test" }
  return expect(context.map(data)).toEqual({
    out: { type: "test", a: 1, b: 2 }
  })
})

test("deep mapping - advanced syntax", () => {
  const context = new Context({ a: "b" })
  const data = {
    a: "a",
    c: {
      a: "b.a",
      d: {
        a: "b.c.a"
      }
    }
  }
  expect(context.map(data)).toEqual({
    b: "a",
    c: {
      b: "b.a",
      d: {
        b: "b.c.a"
      }
    }
  })
})


