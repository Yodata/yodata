const assert = require('assert-plus')
const copy = require('recursive-copy')
const path = require('path')
const through = require('through2')
const Handlebars = require('handlebars')
const get = require('lodash/get')
const logger = require('../util/logger')


module.exports = copyFiles

/**
 * copy template files to {__dirname}/{props.context.name}/
 * @param {object} props
 * @param {string} props.templatePath
 * @param {object} props.context
 * @param {string} props.context.name
 * @returns
 */
async function copyFiles(props) {
	const templatePath = get(props, 'templatePath', 'template')
	const src = path.resolve(__dirname, templatePath)
	const dest = path.resolve(get(props, 'context.name'))
	return await copy(src, dest, {
		rename: (pathname) => {
			return Handlebars.compile(pathname)(props)
		},
		transform: (src) => {
			if (isTemplate(src)) {
				return through(function (chunk, enc, done) {
					const template = Handlebars.compile(chunk.toString())
					done(null, template(props))
				})
			}
		}
	})
		.then(() => {
			return props
		})
		.catch(error => {
			switch (error.code) {
				case 'EEXIST':
					throw new Error(`The project at ${src} already exists.
					Delete it, move it or try another project name.`)
				default:
					throw new Error(error)
			}
		})
}

function isTemplate(pathname) {
	const allowedTemplateFileExtentions = ['.txt', '.js', '.json', '.yaml', '.yml', '.env', '.ttl', '.jsonld', '.rdf', '.md', '.mdx']
	return allowedTemplateFileExtentions.includes(path.extname(pathname))
}
