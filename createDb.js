const mongoose = require('./libs/mongoose')
const EventItem = require('./models/EventItem')

var itemArray = []

itemArray.push(new EventItem({
  name: '100 meter run',
  time: { hour: 10, minutes: 30 }
}))

itemArray.push(new EventItem({
  name: 'High jump',
  time: { hour: 10, minutes: 30 }
}))

itemArray.push(new EventItem({
  name: '1000 meter run',
  time: { hour: 11, minutes: 30 }
}))

itemArray.push(new EventItem({
  name: 'shot put',
  time: { hour: 11, minutes: 45 }
}))

itemArray.push(new EventItem({
  name: 'triple jump',
  time: { hour: 12, minutes: 0 }
}))

itemArray.push(new EventItem({
  name: 'relay race 4x400',
  time: { hour: 12, minutes: 15 }
}))

mongoose.connection.on('open', function (err) {
  if (err) throw err
  var db = mongoose.connection.db
  db.dropDatabase(function (err) {
    if (err) throw err

    var saveItem = function (item) {
      return new Promise(function (resolve) {
        item.save(function (err, item) {
          if (err) throw err
          resolve()
        })
      })
    }

    var saveAllItem = async function (arr) {
      for (const el of arr) {
        await saveItem(el)
      }
    }
    saveAllItem(itemArray).then(function () {
      mongoose.disconnect()
    })
  })
})
