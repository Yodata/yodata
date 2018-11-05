const Context = require('../../context')
const defaultProps = require('../defaultProps')

test("calculated values", () => {
  const context = new Context({
    type: () => ["a", "b"]
  })
  const data = {
    type: "a",
    b:    "type"
  }
  const result = {
    type: ["a", "b"],
    b:    ["a", "b"]
  }
  expect(context.map(data)).toEqual(result)

  const deep = {
    items: {
      type: "test"
    }
  }
  expect(context.map(deep)).toEqual({
    items: {
      type: ["a", "b"]
    }
  })
  const arr = {
    items: [
      {
        type: "a"
      },
      {
        type: "b"
      }
    ]
  }
  expect(context.map(arr)).toEqual({
    items: [
      {
        type: ["a", "b"]
      },
      {
        type: ["a", "b"]
      }
    ]
  })

})

test("defaultProps - object value", () => {
  const context = new Context({
    item: defaultProps({
      type: "Thing"
    })
  })
  const data = { item: { id: 1 } }
  const expected = {
    item: {
      id:   1,
      type: "Thing"
    }
  }
  expect(context.map(data)).toEqual(expected)

})

test("defaultProps - array of objects", () => {
  const context = new Context({
    item: defaultProps({
      type: "Thing"
    })
  })
  const data = { item: [{ id: 1 }] }
  const expected = {
    item: [
      {
        id:   1,
        type: "Thing"
      }
    ]
  }
  expect(context.map(data)).toEqual(expected)

})

test("defaultProps - called on non-objects returns value", () => {
  const context = new Context({
    a: defaultProps({ type: "Thing" })
  })
  const data = {
    a: "string"
  }
  expect(context.map(data)).toEqual({ a: "string" })

})

test("use a value reducer to create a calculated field", () => {
  const data = {
    key:     1,
    nextKey: 0
  }
  const context = new Context({
    nextKey: ({ last }) => last.key + 1
  })
  expect(context.map(data)).toEqual({
    key:     1,
    nextKey: 2
  })

})

test("context functions can mutate the root object", () => {
  const data = {
    event: {
      primary:   "Add",
      secondary: ["Update"]
    }
  }
  const context = new Context({
    event: {
      key: "action",
      val: ({ value, last }) => ({ type: value.primary })
    }
  })
  const result = context.map(data)
  expect(result).toMatchObject({
    action: {
      type: "Add"
    }
  })

})

test("extend source or set defaults with initialValue", () => {
  const data = {
    key: 1
  }
  const context = new Context({
    key: "id"
  })
  const initialValue = {
    type: "Person",
    name: "Dave"
  }
  expect(context.map(data, initialValue)).toEqual({
    id:   1,
    type: "Person",
    name: "Dave"
  })

})

