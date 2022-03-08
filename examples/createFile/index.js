const { createIcsString } = require('notion-calendar-integration')
const fs = require('fs')
createIcsString(process.env.NOTION_TOKEN, process.env.CALENDAR_DB, {
  date: process.env.DATE_PROPERTY_NAME || 'Date',
  info: process.env.INFO_PROPERTY_NAME || 'Info'
}).then(str => {
  fs.writeFileSync('events.ics', str)
})
