require('dotenv').config()
const solid = require('solid-server')

const server = solid.createServer({
  root: process.env.ROOT,
  port: process.env.PORT,
  serverUri: `https://${process.env.HOSTNAME}`,
  webid: true,
  configPath: process.env.CONFIG_PATH,
  dbPath: process.env.DB_PATH,
  sslKey: process.env.KEY_PATH,
  sslCert: process.env.CERT_PATH,
  multiuser: true,
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS
    }
  },
  verbose: true
})

server.listen(process.env.PORT)
