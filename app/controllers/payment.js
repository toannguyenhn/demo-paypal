const request = require('request')
const { Router } = require('express')
const app = require('../../server')

const CLIENT = process.env.CLIENT_PAYPAL
const SECRET = process.env.SECRET_PAYPAL
const PAYPAL_API = 'https://api.paypal.com'

// const app = require('../../server')

const route = new Router()

async function execute(req, res) {
  try {
    const order = await app.model.Payment.findOne({ paymentID: req.body.paymentID })
    // const product = await app.model.Product.findById(order.productId)

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
        // try {
        //   await product.update({ numberInStock: product.numberInStock - 1 })
        // } catch (e) {
        //   res.sendStatus(500);
        //   console.error(e)
        // }
        // 4. Return a success response to the client
        res.json({
          status: 'success'
        });
      });
  } catch (e) {
    res.sendStatus(500);
    console.error(e)
  }
}

async function index(req, res) {
  const { productId } = req.body
  const product = productId === 'sample' ? { price: 10 } : await app.model.Product.findById(productId)
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
        // body: response.body,
        id: response.body.id,
      });
    });
}

async function products(req, res) {
  const { name, price, image } = req.body
  await app.model.Product.create({ name, price, image })
  res.redirect('/')
}

async function update(req, res) {
  const { name, price, image } = req.body
  const product = await app.model.Product.findById(req.params.id)
  await product.update({ name, price, image })
  res.redirect('/')
}

route.post('/create-payment', index)
route.post('/execute-payment', execute)
route.post('/products', products)
route.post('/products/:id', update)

module.exports = route
