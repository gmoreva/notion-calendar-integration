const { Client } = require('@notionhq/client')
const ics = require('ics')
const moment = require('moment')

function createDate (date, onlyDate, hoursToAdd) {
  hoursToAdd = hoursToAdd || 0
  let dateForStart = moment(date)
  if (!onlyDate) {
    dateForStart = dateForStart.add(hoursToAdd, 'hours')
  }
  dateForStart = dateForStart.format('YYYY-MM-DD-H-m').split('-').map(Number)
  if (onlyDate) {
    dateForStart = dateForStart.slice(0, 3)
  }
  return dateForStart
}

function createEvent (rawPage, propertiesNames) {
  let Resp = rawPage
  let link = Resp.url
  let dateProperty = Resp.properties[propertiesNames.date]
  if (dateProperty.date) {
    const onlyDate = dateProperty.date.start.length === 10
    let dateForStart = createDate(dateProperty.date.start, onlyDate)
    let dateForEnd
    if (dateProperty.date.end) {
      dateForEnd = createDate(dateProperty.date.end, onlyDate)
    } else {
      if (onlyDate) {
        dateForEnd = dateForStart
      } else {
        dateForEnd = createDate(dateProperty.date.start, onlyDate, 1)
      }
    }
    let description = link
    if (propertiesNames.info && Resp.properties[propertiesNames.info]) {
      description = (Resp.properties[propertiesNames.info]['rich_text'][0]?.['text']['content'] ?? '') + '\n' + link
    }
    let title = Resp.properties['Name']['title'][0]?.['text']['content'] ?? 'Untitled'
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
