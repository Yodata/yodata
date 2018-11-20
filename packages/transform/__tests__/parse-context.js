const Context = require("../src/context")
const { REMOVE } = require("../src/terms")
const context = new Context()

test("parse string:string - id map", () => {
  expect(context.parseContext({ a: "b" })).toEqual({
    a: { id: "b", name: "a" }
  })
})

test("parse non-string primitives are interpreted as constants", () => {
  expect(context.parseContext({ a: 1 })).toEqual({ a: { name: "a", id: "a", value: 1, type: "Number" } })
})

test("parse.function -> {value: fn}", () => {
  const fn = jest.fn()
  expect(context.parseContext({ a: fn })).toEqual({
    a: {
      id:    "a",
      name:  "a",
      value: fn
    }
  })
})

test("parse string: null - sets remove flag", () => {
  return expect(context.parseContext({ a: null })).toEqual({
    a: { name: "a", id: REMOVE, value: REMOVE }
  })
})

test("parse array values", () => {
  expect(context.parseContext({ a: [1, 2, 3] })).toEqual({
    a: { name: "a", id: "a", type: "Array", value: [1, 2, 3] }
  })
})

test("object values receive default properties name and id}", () => {
  expect(context.parseContext({ a: {} })).toEqual({ a: { name: "a", id: "a" } })
})

test("decorators are not modified (no default name/id)", () => {
  expect(context.parseContext({ "@foo": "bar" })).toEqual({ "@foo": "bar" })
  expect(context.parseContext({ "@foo": true })).toEqual({ "@foo": true })
  expect(context.parseContext({ "@foo": { foo: "bar" } })).toEqual({ "@foo": { foo: "bar" } })
})

test("object with sub-context", () => {
  const cdef = {
    a: {
      context: {
        a: "A"
      }
    }
  }
  const expected = { a: { name: "a", id: "a", context: { a: "A" } } }
  expect(context.parseContext(cdef)).toEqual(expected)
})

test("minimal valid object includes name and/or id", () => {
  expect(context.parseContext({ a: { name: "a" } })).toEqual({ a: { name: "a", id: "a" } })
  expect(context.parseContext({ a: { id: "A" } })).toEqual({ a: { name: "a", id: "A" } })
})

test("empty objects resolve to default {name: K, id: K}", () => {
  expect(context.parseContext({ a: {} })).toEqual({ a: { name: "a", id: "a" } })
})



