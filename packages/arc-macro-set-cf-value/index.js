const setvalue = require('set-value')

module.exports = function setcloudformationvalue (arc, cf, stage) {
  const values = arc['set-cf-values'] || arc['set-cf-value'] || []
  values.forEach(([key, value]) => {
    if (String(value).includes('$STAGE')) {
      value = value.replace('$STAGE', stage)
    }
    setvalue(cf, key, value)
  })
  return cf
}
