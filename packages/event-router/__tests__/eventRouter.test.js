const Router = require('../eventRouter')

let router

beforeEach(() => {
	router = new Router()
})

test('router.add adds route handler', () => {
	const matchValue = {type: 'test'}
	const payload = 'value'
	expect(router.findAll()).toHaveLength(0)
	router.add(matchValue, payload)
	expect(router.findAll()).toHaveLength(1)
})

test('router.find returns a first match', () => {
	router.add({type: 'Action'}, 'action')
	router.add({type: 'Action', actionStatus: 'CompletedActionStatus'}, 'completedAction')
	expect(router.find({type: 'Action'})).toBe('action')
})

test('router.find returns deeper match first', () => {
	router.add({type: 'Action'}, 'action')
	router.add({type: 'Action', actionStatus: 'CompletedActionStatus'}, 'completedAction')
	expect(router.find({type: 'Action'})).toBe('action')
	expect(router.find({type: 'Action', actionStatus: 'CompletedActionStatus'})).toBe('completedAction')
})
test('router.find returns null if there are no handlers', () => {
	expect(router.find()).toBe(null)
})

test('router.findAll returns array', () => {
	router.add({type: 'a'}, () => 'a')
	router.add({type: 'b'}, () => 'b')
	expect(router.findAll()).toBeInstanceOf(Array)
	expect(router.findAll()).toHaveLength(2)
})

test('router.findAll returns an empty array if no matches were found', () => {
	router.add('stringMatch', 'stringVal')
	expect(router.findAll('stringMatch')[0]).toEqual('stringVal')
})

test('callRoute resolves a static value', async () => {
	router.add('test', 'a')
	const resolver = router.callRoute('test')
	await expect(resolver()).resolves.toBe('a')
})

test('callRoute resovles function', async () => {
	const fn = event => ({type: event})
	router.add('test', fn)
	await expect(router.callRoute('test')('Thing')).resolves.toMatchObject({type: 'Thing'})
})

test('callRoute returns the received value if route is undefined', async () => {
	const resolver = router.callRoute('test')
	await expect(resolver('a')).resolves.toBe('a')
	await expect(resolver()).resolves.toBeUndefined()
	await expect(resolver({type: 'a'})).resolves.toMatchObject({type: 'a'})
})

test('route chaining', async () => {
	const event = {type: 'test'}
	router.addHook('beforeRoute', event => ({...event, beforeRoute: true}))
	router.addHook('beforeAction', event => ({...event, beforeAction: true}))
	router.addHook('afterAction', event => ({...event, afterAction: true}))
	router.add(event, event => ({...event, testHandler: true}))
	await expect(router.next(event)).resolves.toMatchObject(expect.objectContaining({
		type: 'test',
		beforeRoute: true,
		beforeAction: true,
		testHandler: true,
		afterAction: true
	}))
})

test('router.next returns a promise', () => {
	expect(router.next({type: 'a'})).toBeInstanceOf(Promise)
})

test('router.next(event) passes event to handler', async () => {
	const event = {type: 'eventType', name: 'eventName'}
	const handler = jest.fn(e => e.type)
	router.add({type: 'eventType'}, handler)
	await expect(router.next(event)).resolves.toBe('eventType')
	expect(handler).toHaveBeenCalledWith(event)
})

test('router.next(event) returns singleton response', async () => {
	const event = {type: 'eventType', name: 'eventName'}
	const handler = jest.fn(e => e.type)
	router.add({type: event.type}, handler)
	const result = await router.next(event)
	expect(result).toEqual(event.type)
})

test('router.hasRoute returns boolean', () => {
	router.add({type: 'a'}, 'a')
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
