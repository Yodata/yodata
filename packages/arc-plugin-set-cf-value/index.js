const setvalue = require('set-value')

module.exports = function setcloudformationvalue (arc, cf, stage) {
  const values = arc['set-cf-values'] || []
  values.forEach(([key, value]) => {
    if (String(value).includes('{stage}')) {
      value = value.replace('{stage}', stage)
    }
    setvalue(cf, key, value)
  })
  return cf
}
