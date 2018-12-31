const { Context, keyOrder } = require('..')
const TOKEN = '@keyOrder'

test("keyOrder - extends", () => {
	let key = TOKEN
	let value = ['a','b','c']
  let a = new Context({[key]: value})
  let b = a.extend({'someOtherKey': 'someOtherValue'})
  expect(a.get(key)).toEqual(value)
  expect(b.get(key)).toEqual(value)
})


test("keyOrder - sorts keys alphabetically by default", () => {
  let context = new Context().use(keyOrder)
  let data = { c: 1, a: 1, b: 1 }
  expect(context.map(data)).toEqual({ a: 1, b: 1, c: 1 })
})

test("keyOrder - @keyOrder.value = [key...] to set a custom order", () => {
  let context = new Context({[TOKEN]: ['foo']}).use(keyOrder)
  let a = 1
  let b = 2
  let c = 3
  let d = 4
  let foo = 5
  let data = { d, b, foo, a, c }
  let result = context.map(data)
  console.log({result})
  expect(Object.keys(result)[0]).toEqual('foo')
})

