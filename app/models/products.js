const moongose = require('mongoose')

const MODEL_NAME = 'product'

const schema = new moongose.Schema({
  name: {
    type: String,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    default: 1000,
  },
  price: {
    type: Number,
    required: true,
  },
}, { timestamps: true })

const initialize = () => moongose.model(MODEL_NAME, schema)

module.exports = {
  name: MODEL_NAME,
  initialize,
}
