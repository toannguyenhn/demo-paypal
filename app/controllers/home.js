const { Router } = require('express')
const app = require('../../server')


const PRODUCTS = [
  { name: 'Business Processing Management', price: 1, cat: 'Group Enterprise', image: 'themes/images/ladies/1.jpg' },
  { name: 'Plat-Form Block Chain', price: 1, cat: 'Block-Chain', image: 'themes/images/ladies/2.jpg' },
  { name: 'Website', price: 1, cat: 'for Beauty', image: 'themes/images/ladies/3.jpg' },
  { name: 'Website', price: 1, cat: 'for Industry Machine', image: 'themes/images/ladies/4.jpg' },
  { name: 'Cashew Application', price: 1, cat: 'Android, iOS', image: 'themes/images/cloth/bootstrap-women-ware1.jpg' },
  { name: 'Gym Application', price: 1, cat: 'Android, iOS', image: 'themes/images/cloth/bootstrap-women-ware2.jpg' },
  { name: 'CRM Application', price: 1, cat: 'Android, iOS', image: 'themes/images/cloth/bootstrap-women-ware3.jpg' },
  { name: 'Agricultural Electronics', price: 1, cat: 'Android, iOS', image: 'themes/images/cloth/bootstrap-women-ware4.jpg' },
]

// PRODUCTS.forEach((product) => app.model.Product.create(product))

const route = new Router()

async function index(req, res) {
  const products = await app.model.Product.find()
  res.render('index', { products })
}

async function admin(req, res) {
  const products = await app.model.Product.find()
  res.render('index_old', { products })
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
route.get('/admin', admin)
route.get('/items/create', create)
route.get('/items/edit/:id', edit)
route.get('/items/:id', items)

module.exports = route
