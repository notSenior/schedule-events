var express = require('express')
var app = express()

app.use(express.json())
app.use(express.static('public'))

const EventItem = require('./models/EventItem')

/* eslint-disable no-path-concat */
app.use('/', express.static(__dirname + '/public'))

app.get('/eventItem/getAll', function (req, res, next) {
  EventItem.find({}, function (err, result) {
    if (err) return next(err)
    res.json(result)
  })
})

app.post('/eventItem/update', async function (req, res, next) {
  var updateItems = []
  try {
    for (const id of req.body.ids) {
      const item = await EventItem.findByIdAndUpdate(id, { time: req.body.time }, err => {
        if (err) throw err
      })
      updateItems.push(item)
    }
  } catch (error) {
    next(error)
  }
  res.json(updateItems)
})

app.post('/eventItem/add', function (req, res, next) {
  EventItem.create(req.body, function (err, result) {
    if (err) return next(err)
    res.json(result)
  })
})

app.post('/eventItem/delete', function (req, res, next) {
  EventItem.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return next(err)
    res.sendStatus(200)
  })
})

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
