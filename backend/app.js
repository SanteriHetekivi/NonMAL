// Libraries
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect('mongodb://mongodb')
  .then(
    () => {
      console.log('Backend Started')
    }
  )
  .catch(
    err => {
      console.error('Backend error:', err.stack)
      process.exit(1)
    }
  )

// App Instance
var app = express()
app.use(helmet())
app.disable('x-powered-by')
app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const SSL_ENABLED = (process.env.SSL_ENABLED === 'true')
const SSL_PROD = (process.env.SSL_PROD === 'true')

if (SSL_ENABLED) {
  // You MUST change 'acme-staging-v02' to 'acme-v02' in production
  const sslServer = (SSL_PROD) ? 'https://acme-v02.api.letsencrypt.org/directory' : 'https://acme-staging-v02.api.letsencrypt.org/directory';
  require('greenlock-express').create(
    {
      // Let's Encrypt v2 is ACME draft 11
      version: 'draft-11',
      server: sslServer,
      email: process.env.SSL_EMAIL,
      agreeTos: true,
      approveDomains: process.env.SSL_DOMAINS.split(','),
      configDir: require('path').join(require('os').homedir(), 'acme', 'etc'),
      app: app.use('/', require('./src/routes')),
      // Join the community to get notified of important updates and help me make greenlock better
      communityMember: false,
      debug: !SSL_PROD
    }
  ).listen(process.env.PORT, process.env.SSL_PORT)
} else {
  app.use('/', require('./src/routes'))
  // Unsecured ports only
  app.listen(process.env.PORT,
    () => {
      console.log('App listening on port: ' + process.env.PORT)
    }
  )
}
