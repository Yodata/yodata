// 'use strict'
// const config = require('..')
// const restorekeys = [
// 	'profile'
// ]
// const restorevalues = []
// const TEST_PROFILE = 'configtest'

// beforeAll(() => {
// 	restorekeys.forEach(key => {
// 		restorevalues.push(config.get(key))
// 	})
// 	config.set('profile', TEST_PROFILE)
// 	config.delete(TEST_PROFILE)
// });

// afterAll(() => {
// 	restorekeys.forEach((key, index) => {
// 		config.set(key, restorevalues[index])
// 	})
// });

// describe('@yodata/config', () => {
// 	it('should get profile name', () => {
// 		expect(config.get('profile')).toEqual(TEST_PROFILE)
// 		expect(config.profile.name()).toEqual(TEST_PROFILE)
// 		expect(config.all()).toHaveProperty('profile', TEST_PROFILE)
// 		expect(config.currentProfile()).toEqual(TEST_PROFILE)
// 	});
// 	it('should validate profile value', () => {
// 		expect(() => config.set('profile', undefined)).toThrow()
// 		expect(() => config.setProfile(undefined)).toThrow()
// 		expect(() => config.profile.use()).toThrow()
// 		expect(() => config.set('profile.foo', 'bar')).toThrow()
// 	});
// 	it('should get and set profile subvalues', () => {
// 		config.delete('default.foo')
// 		config.profile.delete('foo')
// 		expect(config.profile.get('foo')).toBeUndefined()
// 		expect(config.profile.set('foo', 'bar')).toEqual('bar')
// 		expect(config.profile.get('foo')).toEqual('bar')
// 	});
// 	it('should return default values', () => {
// 		config.delete('default.foo.bar')
// 		expect(config.profile.get('foo.bar')).toBeUndefined()
// 		expect(config.set('default.foo.bar', 'bat')).toEqual('bat')
// 		expect(config.profile.get('foo.bar')).toEqual('bat')
// 	});

// })
