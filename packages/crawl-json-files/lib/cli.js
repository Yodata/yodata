#!/usr/bin/env node
'use strict'
const fs = require('fs')
const jsesc = require('jsesc')
const [target, dest, ...options] = process.argv.splice(2)
const clui = require('clui')

if (!(typeof target == 'string' && target.length > 0)) {
	console.error(`error: target required`)
	process.exit()
}

// - FIRST_BRAND_LOGIN
// - APPLICATION_LAUNCH
// - USER_LOGIN
// - ADDRESS_SEARCH
// - FIRST_APP_LOGIN
// - PROPERTY_BASIC_VIEW
// - GPS_BASIC_SEARCH
// - SSO_LOGIN
// - SUBSCRIPTION_SAVE
// - MAP_SEARCH
// - SAVE_PROPERTY
// - NOTIFICATION_EMAIL_SENT
// - LISTING_NUMBER_SEARCH
// - SSO_LOGOUT
// - GPS_ADVANCED_SEARCH
// - PROPERTY
// - SAVE_SEARCH
// - NOTIFICATION_SUBSCRIBE
// - SSO_PRO_LOGIN
// - SHARE_PROPERTY
// - USER_BRAND_HISTORY
// - SSO_TGT_VALIDATION
// - VIEWED_OFFICE_PAGE
// - ROSTER_UPDATE
// - SSO_FORGOT_PWD
// - AUTHENTICATE
// - SSO_RESET_PWD

const { getJsonFiles, createReducer } = require('.')
const files = getJsonFiles(target)
const progressBar = new clui.Progress(100)
const totalFiles = files.length

const REDUCER_OPTIONS = {
	domainidentifier: 'log_payload_activity', // @type identifier
	indexValues: [
		'type',
		'message'
	],
	filter: object => {
		return (
			object['log_payload_activity'] === undefined
		)
	},
	onfile: index => console.log(progressBar.update(index, totalFiles)),
	source: target,
	sampleSize: totalFiles,
}
const reducer = createReducer(REDUCER_OPTIONS)


const result = files.reduce(reducer)
const output = formatOutput(result, REDUCER_OPTIONS)

if (typeof dest === 'string') {
	fs.writeFileSync(dest, output)
	console.log(`results => ${dest}`)
} else {
	console.dir(JSON.parse(output), { depth: 10 })
}


function formatOutput(data, reducerOptions) {
	// convert model.values from js Set to Array
	const { indexValues } = reducerOptions
	if (Array.isArray(indexValues)) {
		indexValues.forEach(key => {
			const item = data.index.get(key)
			item.values = [...item.values]
			data.index.set(key, item)
		})
	}

	const result = { }
	result.source = data.source
	result.count = data.count
	result.keys = [...data.keys].sort()
	result.events = data.events
	result.model = createModel({ keys: result.keys, index: data.index })
	result.mock = createMock(result)

	// result.count

	return jsesc(result, { json: true })
}

function createModel({ keys, index }) {
	const result = {}
	keys.forEach(key => {
		result[key] = index.get(key)
	})
	return result
}

function createObjectFromPairs(pairs, initialValue = {}) {
	if (Array.isArray(pairs)) {
		return pairs.reduce((result, [k, v]) => { result[k] = v; return result }, initialValue)
	}
}

function createMock({ model }) {
	const mock = {}

	Object.entries(model).forEach(([key, props]) => {
		mock[key] = props.values || props.example
	})
	return mock
}
