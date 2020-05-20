const { Router } = require('express')
const app = require('../../server')

const route = new Router()

async function index(req, res) {
  const products = await app.model.Product.find()
  res.render('index', { products })
}

async function create(req, res) {
  res.render('create')
}

async function edit(req, res) {
  const product = await app.model.Product.findById(req.params.id)
  res.render('edit', { product })
}

async function items(req, res) {
  const product = await app.model.Product.findById(req.params.id)
  res.render('list', { product })
}

route.get('/', index)
route.get('/items/create', create)
route.get('/items/edit/:id', edit)
route.get('/items/:id', items)

module.exports = route
