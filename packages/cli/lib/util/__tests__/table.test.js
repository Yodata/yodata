let a
let b
let c
let d
let cols

beforeEach(() => {
	a = { id: 1, name: 'a' }
	b = { id: 2, name: 'b' }
	c = { id: 3 }
	d = { name: 'd' }
	cols = ['name', 'id']
})

describe('table.get.columns', () => {
	const { getColumns } = require('../table')

	test('accepts an object with keys or columns property', () => {
		expect(getColumns({ keys: 'name' }, a)).toEqual(['name'])
		expect(getColumns({ columns: 'name' }, a)).toEqual(['name'])
	})

	test('accepts string array input', () => {
		expect(getColumns(['foo'], a)).toEqual(['foo'])
	})

	test('accepts string input', () => {
		expect(getColumns('foo', a)).toEqual(['foo'])
	})

	test('getcolumns returns object.keys if no keys are provided', () => {
		expect(getColumns(null, a)).toEqual(['id', 'name'])
		expect(getColumns(undefined, a)).toEqual(['id', 'name'])
		expect(getColumns({}, a)).toEqual(['id', 'name'])
		expect(getColumns(1, a)).toEqual(['id', 'name'])
	})
})

describe('table.get.rows', () => {
	const { getRows } = require('../table')

	test('getrows accepts returns array of values in order', () => {
		expect(getRows(['name', 'id'], a)).toEqual(['a', 1])
	})

	it('works', () => {
		expect(getRows(cols, a)).toEqual(['a', 1])
		expect(getRows(cols, [a])).toEqual([['a', 1]])
	})

	test('getrows accepts string keys ', () => {
		expect(getRows('name', a)).toEqual(['a'])
	})

	test('getrows accepts string[] key input ', () => {
		expect(getRows(['name'], a)).toEqual(['a'])
	})

	test('getrows accepts returns rows for each entry data ', () => {
		expect(getRows(['name'], [a, b, c, d])).toEqual([
			['a'],
			['b'],
			[],
			['d']
		])
	})
})
