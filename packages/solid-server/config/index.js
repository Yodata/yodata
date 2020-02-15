
module.exports = {
  root: process.env.SOLID_ROOT,
  port: process.env.SOLID_PORT,
  serverUri: process.env.SOLID_HOST,
  webid: true,
  configPath: '/etc/solid-server',
  dbPath: '/data/solid-server/db',
  sslKey: '/etc/ssl/certs/yodata.dave.key.pem',
  sslCert: '/etc/ssl/certs/yodata.dave.cert.pem',
  multiuser: true,
  email: {
    host: 'email-smtp.us-west-2.amazonaws.com',
    port: '465',
    secure: true,
    auth: {
      user: process.env.SOLID_KEY,
      pass: process.env.SOLID_SECRET
    }
  },
  verbose: true
}
