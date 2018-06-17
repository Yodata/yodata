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
test('router.find returns null if there are no handlers', () => {
  expect(router.find()).toBe(null)
})

test(`router.findAll returns array`, () => {
  router.registerRoute({ type: 'a' }, () => 'a')
  router.registerRoute({ type: 'b' }, () => 'b')
  expect(router.findAll()).toBeInstanceOf(Array)
  expect(router.findAll()).toHaveLength(2)
})

test(`router.findAll returns an empty array if no matches were found`, () => {
  router.registerRoute('stringMatch', 'stringVal')
  expect(router.findAll('stringMatch')[0]).toEqual('stringVal')
})

test('callRoute resolves a static value', async () => {
  router.add('test', 'a')
  let resolver = router.callRoute('test')
  await expect(resolver()).resolves.toBe('a')
})

test('callRoute resovles function', async () => {
  let fn = event => ({type: event})
  router.add('test', fn)
  await expect(router.callRoute('test')('Thing')).resolves.toMatchObject({type: 'Thing'})
})

test('callRoute returns the received value if route is undefined', async () => {
  let resolver = router.callRoute('test')
  await expect(resolver('a')).resolves.toBe('a')
  await expect(resolver()).resolves.toBeUndefined()
  await expect(resolver({type: 'a'})).resolves.toMatchObject({type: 'a'})
})

test('route chaining', async () => {
  let event = {type: 'test'}
  router.add(event, event => ({...event, testHandler: true}))
  router.add('beforeRoute', event => ({...event, beforeRoute: true}))
  let result = Promise.resolve(event)
    .then(router.callRoute('beforeRoute'))
    .then(router.callRoute(event))
  await expect(result).resolves.toMatchObject(expect.objectContaining({type: 'test', 'beforeRoute': true, testHandler: true}))
})

test(`router.next returns a promise`, () => {
  expect(router.next({type: 'a'})).toBeInstanceOf(Promise)
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

test('router.hasRoute returns boolean', () => {
  router.registerRoute({type: 'a'}, 'a')
  expect(router.hasRoute({type: 'a'})).toBe(true)
  expect(router.hasRoute({type: 'b'})).toBe(false)
})

test('addHook adds a string keyed route', () => {
  expect(router.hasRoute('beforeRoute')).toBe(false)
  router.addHook('beforeRoute', event => event)
  expect(router.hasRoute('beforeRoute')).toBe(true)
})

test('addHook.name must be a string', () => {
  expect(() => router.addHook(1, event => event)).toThrowError()
})
