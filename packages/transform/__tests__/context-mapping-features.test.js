const Context = require("../src/context")
const { fromJS } = require("immutable")
const { ADDITIONAL_PROPERTIES } = require("../src/terms")

describe("rename keys", () => {
  test("rename object keys", () => {
    const context = new Context({ key: "nextKey" })
    expect(context.map({ key: "a" })).toEqual({ nextKey: "a" })
  })

  test("renames keys deeply by default", () => {
    const data = fromJS({ a: 1, b: { a: 1 } }).toJS()
    const expected = fromJS({ A: 1, b: { A: 1 } }).toJS()
    const context = new Context({ a: "A" })
    expect(context.map(data)).toEqual(expected)
  })

  test("map supports JSON object notation (dot-notation) on target key paths", () => {
    const context = new Context({ a: "b.c" })
    expect(context.map({ a: 1 })).toEqual({ b: { c: 1 } })
  })

  test("maps type/@type values to context @ids", () => {
    const context = new Context({ "@type": { id: "type" }, type: "type", a: "b" })
    expect(context.map({ type: "a" })).toEqual({ type: "b" })
    expect(context.map({ "@type": "a" })).toEqual({ type: "b" })
  })

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

  test("deep merge", () => {
    const context = new Context({ a: "out.a", b: "out.b" })
    const data = { a: 1, b: 2 }
    return expect(context.map(data)).toEqual({ out: { a: 1, b: 2 } })
  })

  test("map object with sub-context", () => {
    const data = fromJS({ a: { a: 1 } })
    const expected = fromJS({ A: { B: 1 } })
    const context = new Context({
      a: {
        id:      "A",
        context: {
          a: "B"
        }
      }
    })
    expect(context.map(data.toJS())).toEqual(expected.toJS())
  })

  test("deep properties are merged with existing properties", () => {
    const context = new Context({ a: "out.a", b: "out.b", outType: "out.type" })
    const data = { a: 1, b: 2, outType: "test" }
    return expect(context.map(data)).toEqual({
      out: { type: "test", a: 1, b: 2 }
    })
  })

  test("consolidate keys", () => {
    const context = new Context({
      a: "c",
      b: "c"
    })
    const data = {
      a: 1,
      b: 2
    }
    const result = {
      c: [1, 2]
    }
    expect(context.map(data)).toEqual(result)
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
})

describe("map set values", () => {

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
      Agent: "RealEstateAgent"
    }
    const context = new Context(cdef)
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

describe("map functions", () => {
  test("phone => contactPoint", () => {
    const data = {
      BusinessPhone: 1,
      OtherPhone:    2
    }
    const phoneToContactPoint = props => ({
      type:      "ContactPoint",
      name:      props.key,
      telephone: props.value
    })
    const contactPoint = {
      id:  "contactPoint",
      val: phoneToContactPoint
    }
    const context = new Context({
      BusinessPhone: contactPoint,
      OtherPhone:    contactPoint
    })
    expect(context.map(data)).toEqual({
      contactPoint: [
        {
          type:      "ContactPoint",
          name:      "BusinessPhone",
          telephone: 1
        },
        {
          type:      "ContactPoint",
          name:      "OtherPhone",
          telephone: 2
        }
      ]
    })
  })
})

test("add object default values", () => {
  const data = {
    HomePhone: "1",
    WorkPhone: "2"
  }
  const expected = {
    type:         "Person",
    contactPoint: [
      {
        type:      "ContactPoint",
        name:      "HomePhone",
        telephone: "1"
      },
      {
        type:      "ContactPoint",
        name:      "WorkPhone",
        telephone: "2"
      }
    ]
  }
  const context = new Context({
    HomePhone: {
      type:       "ContactPoint",
      id:         "contactPoint",
      collection: "contactPoint",
      value:      {
        type:      "ContactPoint",
        name:      {'@value':'{id}'},
        telephone: {['@value']:'{value}'}
      }
    },
    WorkPhone: {
      type:       "ContactPoint",
      id:         "contactPoint",
      value:      {
        type:      "ContactPoint",
        name:      "{id}",
        telephone: "{value}"
      }
    }
  })
  expect(context.map(data)).toEqual(expected)
})


