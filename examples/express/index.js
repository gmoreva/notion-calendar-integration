const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const { createIcsString } = require('notion-calendar-integration')

app.get('/events.ics', (req, res) => {
  createIcsString(process.env.NOTION_TOKEN, process.env.CALENDAR_DB, {
    date: process.env.DATE_PROPERTY_NAME || 'Date',
    info: process.env.INFO_PROPERTY_NAME || 'Info'
  }).then(str => {
    res.send(str)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
