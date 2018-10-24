'use strict'

const _ = require('lodash')
const clc = require('cli-color')
const ansiStrip = require('cli-color/strip')
const configstore = require('../lib/configstore')
const track = require('./track')
const logger = require('./logger')
const utils = require('./utils')
const FirebaseError = require('./error')
const RC = require('./rc')
const Config = require('./config')
const detectProjectRoot = require('./detect-project-root')

const Command = function (cmd) {
	this._cmd = cmd
	this._name = _.first(cmd.split(' '))
	this._description = null
	this._options = []
	this._action = null
	this._befores = []
}

Command.prototype.description = function (description) {
	this._description = description
	return this
}

Command.prototype.option = function () {
	this._options.push(arguments)
	return this
}

Command.prototype.before = function (fn, args) {
	this._befores.push({
		fn,
		args
	})
	return this
}

Command.prototype.action = function (fn) {
	this._action = fn
	return this
}
// Ignoring this in coverage for now since it's just wrapping commander
/* istanbul ignore next */
Command.prototype.register = function (client) {
	this.client = client
	const program = client.cli
	const cmd = program.command(this._cmd)
	if (this._description) {
		cmd.description(this._description)
	}
	this._options.forEach(args => {
		cmd.option(...args)
	})

	const self = this
	cmd.action(function () {
		const runner = self.runner()
		const start = new Date().getTime()
		const options = _.last(_.toArray(arguments))
		const argCount = cmd._args.length
		if (arguments.length - 1 > argCount) {
			return client.errorOut(
				new FirebaseError(
					'Too many arguments. Run ' +
						clc.bold('firebase help ' + cmd._name) +
						' for usage instructions',
					{exit: 1}
				)
			)
		}

		runner
			.apply(self, arguments)
			.then(result => {
				if (utils.getInheritedOption(options, 'json')) {
					console.log(
						JSON.stringify(
							{
								status: 'success',
								result
							},
							null,
							2
						)
					)
				}
				const duration = new Date().getTime() - start
				track(self._name, 'success', duration).then(process.exit)
			})
			.catch(err => {
				if (utils.getInheritedOption(options, 'json')) {
					console.log(
						JSON.stringify(
							{
								status: 'error',
								error: err.message
							},
							null,
							2
						)
					)
				}
				const duration = Date.now() - start
				const errorEvent =
					err.exit === 1 ? 'Error (User)' : 'Error (Unexpected)'

				const preppedMessage = ansiStrip(err.message || '')

				return Promise.all([
					track(self._name, 'error', duration),
					track(errorEvent, preppedMessage, duration)
				]).then(() => {
					client.errorOut(err)
				})
			})

		return cmd
	})
}

Command.prototype._prepare = function (options) {
	options = options || {}
	options.project = utils.getInheritedOption(options, 'project')

	if (
		!process.stdin.isTTY ||
		utils.getInheritedOption(options, 'nonInteractive')
	) {
		options.nonInteractive = true
	}
	// Allow override of detected non-interactive with --interactive flag
	if (utils.getInheritedOption(options, 'interactive')) {
		options.nonInteractive = false
	}

	if (utils.getInheritedOption(options, 'debug')) {
		logger.transports.console.level = 'debug'
		options.debug = true
	}
	if (utils.getInheritedOption(options, 'json')) {
		options.nonInteractive = true
		logger.transports.console.level = 'none'
	}

	try {
		options.config = Config.load(options)
	} catch (e) {
		options.configError = e
	}

	options.projectRoot = detectProjectRoot(options.cwd)
	this.applyRC(options)
	return Promise.resolve()
}

/**
 * Apply configuration from .firebaserc files in the working directory tree.
 */
Command.prototype.applyRC = function (options) {
	const rc = RC.load(options.cwd)
	options.rc = rc

	options.project =
		options.project ||
		(configstore.get('activeProjects') || {})[options.projectRoot]
	// Support deprecated "firebase" key in firebase.json
	if (options.config && !options.project) {
		options.project = options.config.defaults.project
	}

	const aliases = rc.projects
	const rcProject = _.get(aliases, options.project)
	if (rcProject) {
		options.projectAlias = options.project
		options.project = rcProject
	} else if (!options.project && _.size(aliases) === 1) {
		options.projectAlias = _.head(_.keys(aliases))
		options.project = _.head(_.values(aliases))
	}
}

Command.prototype.runner = function () {
	const self = this
	return function () {
		const args = _.toArray(arguments)
		// Always provide at least an empty object for options
		if (args.length === 0) {
			args.push({})
		}
		const options = _.last(args)

		try {
			const befores = [self._prepare].concat(self._befores)
			let result = befores.shift().call(self, options)
			befores.forEach(before => {
				result = result.then(() => {
					return before.fn.call(self, options, before.args)
				})
			})
			return result.then(() => {
				return self._action(...args)
			})
		} catch (e) {
			return Promise.reject(e)
		}
	}
}

module.exports = Command
