'use strict'
const config = require('..')

describe('package.interfaces', () => {
	it('exports Profile constructor', () => {
		expect(config).toHaveProperty('Profile')
	})

	it('exports function currentProfile', () => {
		expect(config).toHaveProperty('currentProfileName')
	})

	it('exports function useProfile', () => {
		expect(config).toHaveProperty('useProfile')
	})

	it('exports function addProfile', () => {
		expect(config).toHaveProperty('addProfile')
	})

	it('exports function removeProfile', () => {
		expect(config).toHaveProperty('removeProfile')
	})

	it('exports function listProfiles', () => {
		expect(config).toHaveProperty('listProfiles')
	})

	it('exports function hasProfile', () => {
		expect(config).toHaveProperty('hasProfile')
	})
})
