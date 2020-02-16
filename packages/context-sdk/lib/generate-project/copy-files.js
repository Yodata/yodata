const path = require('path')
const copy = require('recursive-copy')
const through = require('through2')
const Handlebars = require('handlebars')
const assert = require('assert-plus')

module.exports = copyFiles

/**
 * Copy template files to {__dirname}/{props.context.name}/
 * @param {object} props
 * @param {string} props.name
 * @param {string} [props.templatePath]
 */
async function copyFiles (props) {
  assert.string(props.name)
  const templatePath = props.templatePath || 'template'
  const src = path.resolve(__dirname, templatePath)
  const dest = path.resolve(props.name)
  return copy(src, dest, {
    rename: pathname => {
      return Handlebars.compile(pathname)(props)
    },
    transform: src => {
      if (isTemplate(src)) {
        return through((chunk, enc, done) => {
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
          throw new Error(`The project at ${dest} already exists. Delete it, move it or try another project name.`)
        default:
          throw new Error(`Something went terribly wrong: ${error.message}`)
      }
    })
}

function isTemplate (pathname) {
  const allowedTemplateFileExtentions = ['.txt', '.js', '.json', '.yaml', '.yml', '.env', '.ttl', '.jsonld', '.rdf', '.md', '.mdx', '.zsh']
  return allowedTemplateFileExtentions.includes(path.extname(pathname))
}
