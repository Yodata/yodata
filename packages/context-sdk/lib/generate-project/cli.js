#!/usr/bin/env node
const inquirer = require('inquirer')
const logger = require('../util/logger')
const showHelp = require('./show-help')
const generateProject = require('.')
const questions = require('./questions')

inquirer
	.prompt(questions)
	.then(generateProject)
	.then(showHelp)
	.catch(logger.error)
