const copy = require('recursive-copy')
const path = require('path')
const through = require('through2')
const Handlebars = require('handlebars')
const logger = require('../util/logger')

const allowedTemplateFileExtentions = ['.txt', '.js', '.json', '.yaml', '.yml', '.env', '.ttl', '.jsonld', '.rdf', '.md', '.mdx']

module.exports = async function copyFiles(props) {
	const templatePath = props.templatePath || './template'
	const src = path.resolve(__dirname, templatePath)
	const dest = path.resolve(process.cwd(), props.context.name)
	return await copy(src, dest, {
		rename: (filePath) => {
			const template = Handlebars.compile(filePath)
			const result = template(props)
			return result
		},
		transform: (src) => {
			let result
			if (allowedTemplateFileExtentions.includes(path.extname(src))) {
				result = through(function (chunk, enc, done) {
					const template = Handlebars.compile(chunk.toString())
					done(null, template(props))
				})
			}
			return result
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
