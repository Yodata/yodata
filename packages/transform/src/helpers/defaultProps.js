const isPlainObject = require("lodash/isPlainObject")
const defaultProps = defaultProps => ({ value }) => {
  if (isPlainObject(value)) {
    return { ...defaultProps, ...value }
  }
  return value
}
module.exports = defaultProps

