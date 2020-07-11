const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test123', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

module.exports = mongoose
