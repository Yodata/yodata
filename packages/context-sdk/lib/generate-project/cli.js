#!/usr/bin/env node
const inquirer = require('inquirer')
const kebabCase = require('lodash/kebabCase')
const logger = require('../util/logger')
const showHelp = require('./show-help')
const generateProject = require('./generate-project')
const { config } = require('@yodata/cli')

const questions = [
	{
		name: 'sourceContext',
		message: 'project name',
		default: 'my-context',
		filter: kebabCase
	},
	{
		name: 'sourceDescription',
		message: 'project description'
	},
	{
		name: 'validationSchema',
		default: 'https://realestate.yodata.me/context/v1/schema.yaml'
	},
]

const { YODATA_POD_URL, YODATA_POD_SECRET } = process.env

if (!YODATA_POD_URL) questions.push({
	name: 'podURL',
	message: 'service pod URL',
	default: function () {
		return YODATA_POD_URL || 'https://yourpod.yodata.me'
	}
})

if (!YODATA_POD_SECRET) questions.push({
	name: 'podSecret',
	message: 'pod secret (x-api-key)',
	default: function () {
		return YODATA_POD_SECRET || 'secret'
	}
})

inquirer
	.prompt(questions)
	.then(generateProject({ templatePath: './template' }))
	.then(showHelp)
	.catch(logger.error)
