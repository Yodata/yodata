'use strict'

const path = require('path')
const _ = require('lodash')
const clc = require('cli-color')
const cjson = require('cjson')
const fs = require('fs-extra')

const detectProjectRoot = require('./detect-project-root')
const YodataError = require('./error')
const fsutils = require('./fsutils')
const loadCJSON = require('./load-cjson')
const parseBoltRules = require('./parse-bolt-rules')
const prompt = require('./prompt')
const resolveProjectPath = require('./resolve-project-path')
const utils = require('./utils')

const Config = function (src, options) {
	this.options = options || {}
	this.projectDir = options.projectDir || detectProjectRoot(options.cwd)

	this._src = src
	this.data = {}
	this.defaults = {}
	this.notes = {}

	if (this._src.firebase) {
		this.defaults.project = this._src.firebase
		utils.logWarning(
			clc.bold('"firebase"') +
				' key in firebase.json is deprecated. Run ' +
				clc.bold('firebase use --add') +
				' instead'
		)
	}

	if (_.has(this._src, 'rules')) {
		_.set(this._src, 'database.rules', this._src.rules)
	}

	Config.MATERIALIZE_TARGETS.forEach(function (target) {
		if (_.get(this._src, target)) {
			_.set(this.data, target, this._materialize(target))
		}
	}, this)

	// Auto-detect functions from package.json in directory
	if (
		this.projectDir &&
		!this.get('functions.source') &&
		fsutils.fileExistsSync(this.path('functions/package.json'))
	) {
		this.set('functions.source', 'functions')
	}

	// Use 'public' as signal for legacy hosting since it's a required key
	if (!this.data.hosting && this._src.public) {
		this.importLegacyHostingKeys()
	}
}

Config.FILENAME = 'firebase.json'
Config.MATERIALIZE_TARGETS = [
	'database',
	'functions',
	'hosting',
	'storage',
	'firestore'
]
Config.LEGACY_HOSTING_KEYS = [
	'public',
	'rewrites',
	'redirects',
	'headers',
	'ignore',
	'cleanUrls',
	'trailingSlash'
]

Config.prototype.importLegacyHostingKeys = function () {
	let found = false
	Config.LEGACY_HOSTING_KEYS.forEach(function (key) {
		if (_.has(this._src, key)) {
			found = true
			this.set('hosting.' + key, this._src[key])
		}
	}, this)
	if (found) {
		utils.logWarning(
			'Deprecation Warning: Firebase Hosting configuration should be moved under "hosting" key.'
		)
	}
}

Config.prototype._hasDeepKey = function (obj, key) {
	if (_.has(obj, key)) {
		return true
	}

	for (const k in obj) {
		if (_.isPlainObject(obj[k]) && this._hasDeepKey(obj[k], key)) {
			return true
		}
	}
	return false
}

Config.prototype._materialize = function (target) {
	const val = _.get(this._src, target)
	if (_.isString(val)) {
		let out = this._parseFile(target, val)
		// If e.g. rules.json has {"rules": {}} use that
		const lastSegment = _.last(target.split('.'))
		if (_.size(out) === 1 && _.has(out, lastSegment)) {
			out = out[lastSegment]
		}
		return out
	}
	if (_.isPlainObject(val) || _.isArray(val)) {
		return val
	}

	throw new YodataError(
		'Parse Error: "' + target + '" must be object or import path',
		{
			exit: 1
		}
	)
}

Config.prototype._parseFile = function (target, filePath) {
	const fullPath = resolveProjectPath(this.options.cwd, filePath)
	const ext = path.extname(filePath)
	if (!fsutils.fileExistsSync(fullPath)) {
		throw new YodataError(
			'Parse Error: Imported file ' + filePath + ' does not exist',
			{
				exit: 1
			}
		)
	}

	switch (ext) {
	case '.json':
		if (target === 'database') {
			this.notes.databaseRules = 'json'
		} else if (target === 'database.rules') {
			this.notes.databaseRulesFile = filePath
			return fs.readFileSync(fullPath, 'utf8')
		}
		return loadCJSON(fullPath)
		/* istanbul ignore-next */
	case '.bolt':
		if (target === 'database') {
			this.notes.databaseRules = 'bolt'
		}
		return parseBoltRules(fullPath)
	default:
		throw new YodataError(
			'Parse Error: ' + filePath + ' is not of a supported config file type',
			{exit: 1}
		)
	}
}

Config.prototype.get = function (key, fallback) {
	return _.get(this.data, key, fallback)
}

Config.prototype.set = function (key, value) {
	return _.set(this.data, key, value)
}

Config.prototype.has = function (key) {
	return _.has(this.data, key)
}

Config.prototype.path = function (pathName) {
	const outPath = path.normalize(path.join(this.projectDir, pathName))
	if (_.includes(path.relative(this.projectDir, outPath), '..')) {
		throw new YodataError(
			clc.bold(pathName) + ' is outside of project directory',
			{exit: 1}
		)
	}
	return outPath
}

Config.prototype.readProjectFile = function (p, options) {
	options = options || {}
	try {
		const content = fs.readFileSync(this.path(p), 'utf8')
		if (options.json) {
			return JSON.parse(content)
		}
		return content
	} catch (e) {
		if (options.fallback) {
			return options.fallback
		}
		throw e
	}
}

Config.prototype.writeProjectFile = function (p, content) {
	if (typeof content !== 'string') {
		content = JSON.stringify(content, null, 2) + '\n'
	}

	fs.ensureFileSync(this.path(p))
	fs.writeFileSync(this.path(p), content, 'utf8')
}

Config.prototype.askWriteProjectFile = function (p, content) {
	const writeTo = this.path(p)
	let next
	if (fsutils.fileExistsSync(writeTo)) {
		next = prompt.once({
			type: 'confirm',
			message: 'File ' + clc.underline(p) + ' already exists. Overwrite?',
			default: false
		})
	} else {
		next = Promise.resolve(true)
	}

	const self = this
	return next.then(result => {
		if (result) {
			self.writeProjectFile(p, content)
			utils.logSuccess('Wrote ' + clc.bold(p))
		} else {
			utils.logBullet('Skipping write of ' + clc.bold(p))
		}
	})
}

Config.load = function (options, allowMissing) {
	const pd = detectProjectRoot(options.cwd)
	if (pd) {
		try {
			const data = cjson.load(path.join(pd, Config.FILENAME))
			return new Config(data, options)
		} catch (e) {
			throw new YodataError(
				'There was an error loading firebase.json:\n\n' + e.message,
				{
					exit: 1
				}
			)
		}
	}

	if (allowMissing) {
		return null
	}

	throw new YodataError(
		'Not in a Firebase app directory (could not locate firebase.json)',
		{
			exit: 1
		}
	)
}

module.exports = Config
