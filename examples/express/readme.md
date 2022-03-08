# Create simple ics file example

After run index.js you will receive ics on you http://localhost:3000/events.ics, now you can publish it on your web server and add your link to your favorite calendar and it will sync automatically

Environment vars, needed for run:
```
NOTION_TOKEN - token
PORT - port, which has to be used for http server
CALENDAR_DB - database with your calendar events
DATE_PROPERTY_NAME - property name of you date
INFO_PROPERTY_NAME - property name of you event description
```

After receiving events.ics file you can import it in your loved calendar
