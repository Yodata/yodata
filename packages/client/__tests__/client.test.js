'use strict';
const { createClient } = require('..');

describe('@yodata/client', () => {
	test('create.client', () => {
		const client = createClient()
		expect(client).toHaveProperty('defaults.options.headers.user-agent', 'yodata/client (https://yodata.io)')
	})
});
