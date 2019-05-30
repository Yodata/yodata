#!/usr/bin/env node
const inquirer = require('inquirer')
const logger = require('../util/logger')
const generateProject = require('../generate-project')
const showHelp = require('./show-help')
const questions = require('./questions')

inquirer
	.prompt(questions)
	.then(generateProject)
	.then(showHelp)
	.catch(logger.error)
