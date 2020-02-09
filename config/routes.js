const { Router } = require('express')
const user = require('../app/controllers/user')
const channel = require('../app/controllers/channel')
const admin = require('../app/controllers/admin')
const authentication = require('../app/controllers/authentication')
const auth = require('../app/middlewares/authorization')

module.exports = function (app) {
  const apiRoute = new Router()

  app.use('/api', apiRoute)

  apiRoute.use('/authentication', authentication)
  apiRoute.use('/users', auth, user)
  apiRoute.use('/channels', auth, channel)
  apiRoute.use('/admin', admin)

  // Error handling
  app.use((err, req, res, next) => {
    if (err.stack) {
      // if (err.stack.includes('ValidationError')) {
      //   res.status(422).render('422', { error: err.stack })
      //   return
      // }
      if (process.env.NODE_ENV === 'development') {
        res.status(500).json({ error: err.message })
      } else {
        res.status(500).json({ error: 'Internal error' })
      }
      return
    }
    next()
  })

  // Return 404 since have no matched router
  app.use((req, res) => {
    const payload = {
      url: req.originalUrl,
      error: 'Not found',
    }
    if (req.accepts('html')) {
      return res.status(404).render('404', payload)
    }
    return res.status(404).json(payload)
  })
}
