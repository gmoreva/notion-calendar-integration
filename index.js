const { Client } = require('@notionhq/client')
const ics = require('ics')
const moment = require('moment')

function createDate (date) {
  let dateForStart = moment(date).format('YYYY-MM-DD-H-m').split('-')
  dateForStart = dateForStart.map(Number)
  if (dateForStart[3] === 0) {
    dateForStart = dateForStart.slice(0, 3)
  }
  return dateForStart
}

function createEvent (rawPage, propertiesNames) {
  let Resp = rawPage
  let link = Resp.url
  let dateProperty = Resp.properties[propertiesNames.date]
  if (dateProperty.date) {
    let dateForStart = createDate(dateProperty.date.start)
    let dateForEnd = dateProperty.date.end ? createDate(dateProperty.date.end) : dateForStart
    let description = Resp.properties[propertiesNames.info]['rich_text'][0]?.['text']['content'] ?? ''
    let title = Resp.properties['Name']['title'][0]?.['text']['content'] ?? 'Untitled'
    description += '\n' + link
    return {
      title,
      description,
      start: dateForStart,
      end: dateForEnd,
      url: link
    }
  }
}

async function createIcsString (notionToken, calendarDb, propertiesNames) {
  const notion = new Client({
    auth: notionToken,
  })
  const Resps = await notion.databases.query({
    database_id: calendarDb,
  })
  const Events = []
  for (Resp of Resps.results) {
    let ev = createEvent(Resp, propertiesNames)
    ev && Events.push(ev)
  }

  const icsEvent = ics.createEvents(Events)
  if (icsEvent.error) {
    console.error(icsEvent.error)
    return
  }
  return icsEvent.value
}

module.exports = {
  createIcsString
}
