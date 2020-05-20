const request = require('request')
const app = require('../../server')
const CLIENT = 'AQhd8zrhRzjR3AzSVsiJNhie2BbfCUgnUTvrdPEySHtFU5z2FLFM5t7WR825yt9dB1BNVQ7ax2W1I3DN'
const SECRET = 'ELOWl4OcOT8KpJ3-WH2zchV2u1HzMaeQB3uXkwBCSq85_p1YpgTpjvRbw151Inu3MYAT7KVNRdBTmG7u'
const PAYPAL_API = 'https://api.sandbox.paypal.com'

const { Router } = require('express')
// const app = require('../../server')

const route = new Router()

async function execute(req, res) {
  const order = await app.model.Payment.findOne({ paymentID: req.body.paymentID })
  const product = await app.model.Product.findById(order.productId)
  
  const paymentID = req.body.paymentID
  const payerID = req.body.payerID

  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  request.post(
    PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute',
    {
      auth:
      {
        user: CLIENT,
        pass: SECRET
      },
      body:
      {
        payer_id: payerID,
        transactions: [
          {
            amount:
            {
              total: order.price,
              currency: 'USD'
            }
          }]
      },
      json: true
    },
    async (err, response) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      await product.update({ numberInStock: product.numberInStock - 1 })
      // 4. Return a success response to the client
      res.json(
        {
          status: 'success'
        });
    });
}

async function index(req, res) {
  const { productId } = req.body
  const product = await app.model.Product.findById(productId)
  if (!product) throw new Error(500)

  request.post(PAYPAL_API + '/v1/payments/payment',
    {
      auth:
      {
        user: CLIENT,
        pass: SECRET
      },
      body:
      {
        intent: 'sale',
        payer:
        {
          payment_method: 'paypal',
        },
        transactions: [
          {
            amount:
            {
              total: product.price,
              currency: 'USD'
            },
          }],
        redirect_urls:
        {
          return_url: 'https://example.com',
          cancel_url: 'https://example.com'
        },
      },
      json: true,
    }, async (err, response) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      try {
        await app.model.Payment.create({
          paymentID: response.body.id,
          price: product.price,
          productId,
        })
      } catch (e) {
        console.error(e);
        return res.sendStatus(500);
      }

      // 3. Return the payment ID to the client
      res.json({
        body: response.body,
        id: response.body.id,
      });
    });
}

async function products(req, res) {
  const { name, price } = req.body
  await app.model.Product.create({ name, price })
  res.redirect('/')
}

async function update(req, res) {
  const { name, price } = req.body
  const product = await app.model.Product.findById(req.params.id)
  await product.update({ name, price })
  res.redirect('/')
}

route.post('/create-payment', index)
route.post('/execute-payment', execute)
route.post('/products', products)
route.post('/products/:id', update)

module.exports = route
