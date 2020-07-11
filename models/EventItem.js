const mongoose = require('../libs/mongoose')
const Schema = mongoose.Schema

var EventItem = new Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    hour: {
      type: Number,
      required: true
    },
    minutes: {
      type: Number,
      required: true
    }
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('EventItem', EventItem)
