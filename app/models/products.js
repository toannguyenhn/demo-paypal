const moongose = require('mongoose')

const MODEL_NAME = 'product'

const schema = new moongose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
  cat: {
    type: String,
    default: '',
  },
}, { timestamps: true })

const initialize = () => moongose.model(MODEL_NAME, schema)

module.exports = {
  name: MODEL_NAME,
  initialize,
}
