const Router = require('../eventRouter')
let router

beforeEach(() => {
  router = new Router()
})

test('registerRoute', () => {
  let matchValue = { type: 'test' }
  let payload = 'value'
  router.registerRoute(matchValue, payload)
  expect(router.find(matchValue)).toEqual(payload)
})

test(`router.find returns a singleton value`, () => {
  let event = { type: 'Action', status: 'CompletedActionStatus' }
  let handler = jest.fn()
  router.registerRoute({ type: event.type }, handler)
  let found = router.find(event)
  expect(found).toEqual(handler)
  found('foo')
  expect(handler).toHaveBeenCalled()
})

test(`router.findAll returns array`, () => {
  router.registerRoute({ type: 'a' }, () => 'a')
  router.registerRoute({ type: 'b' }, () => 'b')
  expect(router.findAll()).toBeInstanceOf(Array)
})

test(`router.findAll returns an empty array if no matches were found`, () => {
  router.registerRoute('stringMatch', 'stringVal')
  expect(router.findAll('stringMatch')[0]).toEqual('stringVal')
})

test(`router.next(event) passes event to handler`, async () => {
  let event = { type: 'eventType', name: 'eventName' }
  let handler = jest.fn(e => e.type)
  router.registerRoute({ type: event.type }, handler)
  await router.next(event)
  expect(handler).toHaveBeenCalledWith(event)
})

test(`router.next(event) returns singleton response`, async () => {
  let event = { type: 'eventType', name: 'eventName' }
  let handler = jest.fn(e => e.type)
  router.registerRoute({ type: event.type }, handler)
  let result = await router.next(event)
  expect(result).toEqual(event.type)
})
