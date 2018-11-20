const Context = require("../context")
const plugin = require("./plugin-default-values")
const TOKEN = "@default"

describe("MAP", function() {
  test("assigns value of @default on MAP", () => {
    const context = new Context({ "@default": { type: "A" } }).use(plugin)
    expect(context.map({})).toEqual({ type: "A" })
  })


})

test("assigns values to the current node on map", () => {
  const context = new Context({ "@default": { type: "A" } }).use(plugin)
  expect(context.map({})).toEqual({ type: "A" })
})

test("@default does not extend to sub-contexts", () => {
  const a = new Context({
    "@default": {
      type: "Person"
    }
  }).use(plugin)
  const b = a.extend({ a: "b" })
  expect(a.has(TOKEN)).toBe(true)
  expect(b.has(TOKEN)).toBe(false)
})

test("object properties can have different defaults from the root", () => {
  const context = new Context({
    "@default": { type: "Root" },
    a:          {
      context: {
        "@default": {
          type: "A"
        }
      }
    },
    b:          {
      context: {
        "@default": {
          type: "B"
        }
      }
    }
  }).use(plugin)
  expect(context.map({ a: { "name": "dave" }, b: { "name": "alice" } })).toEqual({
    type: "Root",
    a:    {
      type: "A",
      name: "dave"
    },
    b:    {
      type: "B",
      name: "alice"
    }
  })
})

test("@default does not assign to sub-objects", () => {
  const context = new Context({ "@default": { type: "A" } }).use(plugin)
  expect(context.map({ name: "name", parent: { name: "parentName" } })).toEqual({
    type:   "A",
    name:   "name",
    parent: { name: "parentName" }
  })
})

test("default values do not over-write data values", () => {
  const context = new Context({ "@default": { type: "A" } }).use(plugin)
  expect(context.map({ type: "B" })).toEqual({ type: "B" })
})

test("@default default => deep mapped key", () => {
  let context = new Context({
    "@default": {
      ownerType: "Person"
    },
    ownerType:  "owner.type",
    name:       "owner.name"
  }).use(plugin)
  return expect(context.map({ name: "dave" })).toEqual({ owner: { type: "Person", name: "dave" } })
})




