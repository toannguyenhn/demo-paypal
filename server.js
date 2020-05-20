require('dotenv').config()

const express = require('express')
const config = require('./config')
const { connectDB, model } = require('./app/db')

const { port } = config
const app = express()

app.model = model

module.exports = app

// Bootstrap routes
require('./config/express')(app)
require('./config/passport')(app, model)
require('./config/routes')(app)

// app.mailer = require('./app/mailer')
// app.redis = require('./config/redis')

function listen() {
  const server = app.listen(port)
  // app.io = require('./config/socket')(server)
  console.log(`Express app started on port ${port}`)
}

function connect() {
  connectDB()
    .then(async () => {
      listen()
      console.log('Connection DB has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    })
}

connect()
