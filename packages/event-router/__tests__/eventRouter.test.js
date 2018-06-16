const Router = require('../eventRouter')
let router

beforeEach(() => {
  router = new Router()
})

test('router.registerRoute adds route handler', () => {
  let matchValue = { type: 'test' }
  let payload = 'value'
  expect(router.findAll()).toHaveLength(0)
  router.registerRoute(matchValue, payload)
  expect(router.findAll()).toHaveLength(1)
})

test(`router.find returns a first match`, () => {
  router.registerRoute({type: 'Action'}, 'action')
  router.registerRoute({type: 'Action', actionStatus: 'CompletedActionStatus'}, 'completedAction')
  expect(router.find({type: 'Action'})).toBe('action')
})

test(`router.find returns deeper match first`, () => {
  router.registerRoute({type: 'Action'}, 'action')
  router.registerRoute({type: 'Action', actionStatus: 'CompletedActionStatus'}, 'completedAction')
  expect(router.find({type: 'Action'})).toBe('action')
  expect(router.find({type: 'Action', actionStatus: 'CompletedActionStatus'})).toBe('completedAction')
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
