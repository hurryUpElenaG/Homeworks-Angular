## Homework 3 — HTTP and API Integration

Nestly now loads stay data from the Nestly NestJS API instead of using a hardcoded Stay[] array.

The Angular application uses:

- provideHttpClient() in app.config.ts
- HttpClient inside StaysService
- typed HTTP responses with HttpClient.get<Stay[]>() and HttpClient.get<Stay>()
- Observable and subscribe() for HTTP requests
- loading states while requests are in progress
- error states when the API cannot be reached
- 404 handling for missing stays

# API
The Angular application calls:
http://localhost:3000/api/stays

The single-stay endpoint is:
http://localhost:3000/api/stays/:id

# Superhost filtering
For the "Show superhosts only" feature, I chose server-side filtering.

When the filter is enabled, Angular calls:
GET /api/stays?superhost=true

instead of downloading all stays and filtering them in the browser.

I chose this approach because the Nestly API already supports the superhost query parameter, so the backend performs the filtering and Angular receives only the stays that are needed.

# Favorites
Favorites remain completely client-side and are stored in memory using an Angular signal because the API does not provide a favorites endpoint.


## How the finished application works

After everything is changed, the flow is:

# Home page
User opens /
      ↓
StaysListComponent.ngOnInit()
      ↓
loadStays()
      ↓
StaysService.getStays()
      ↓
HttpClient.get<Stay[]>()
      ↓
GET http://localhost:3000/api/stays
      ↓
NestJS
      ↓
PostgreSQL
      ↓
Stay[]
      ↓
subscribe()
      ↓
this.stays.set(stays)
      ↓
@for
      ↓
StayCard


# Superhost filter
User clicks "Show superhosts only"
             ↓
showSuperhostsOnly = true
             ↓
loadStays()
             ↓
getStays({ superhost: true })
             ↓
GET /api/stays?superhost=true
             ↓
NestJS filters database
             ↓
only superhost stays
             ↓
Angular displays them

# Detail page
/stays/3
   ↓
ActivatedRoute
   ↓
stayId = 3
   ↓
StaysService.getStay(3)
   ↓
GET /api/stays/3
   ↓
NestJS
   ↓
PostgreSQL
   ↓
Stay
   ↓
stay.set(stay)
   ↓
detail template

# Invalid ID
/stays/999
     ↓
GET /api/stays/999
     ↓
NestJS
     ↓
404
     ↓
HttpErrorResponse
     ↓
error.status === 404
     ↓
notFound = true
     ↓
"Stay not found"

# Server stopped
Angular
   ↓
GET /api/stays
   ↓
❌ server unavailable
   ↓
error callback
   ↓
errorMessage()
   ↓
"Something went wrong"
   ↓
"Try again"

So you won't get a blank page or an endless spinner.