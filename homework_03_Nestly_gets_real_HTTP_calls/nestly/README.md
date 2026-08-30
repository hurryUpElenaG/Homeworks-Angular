# Nestly

 ## What I changed
- Added Angular Router configuration in app.routes.ts
- Added lazy-loaded routes with loadComponent
  + / → listings
  + /stays/:id → stay detail
  + /** → not found
-  Added <router-outlet> to the root component
- Added Material navigation with:
  + routerLink
  + routerLinkActive
- Moved the stays data into a StaysService with providedIn: 'root'
- Moved the favorite state into the service so favorites remain consistent between list/detail pages
-  Created:
  + pages/stays-list
  + pages/stay-detail
  + pages/not-found
- Added ActivatedRoute lookup for stays/:id
- Added an inline Stay not found state for invalid stay IDs
- Added View details Material buttons to the existing stay cards
- Kept your existing:
  + StayCardComponent
  + CardShellComponent
  + BadgeComponent
  + TruncatePipe
  + appHighlightCard
  + Angular Material components
- Preserved the Superhost filter and favorite functionality
- Added responsive styling for the listings grid

##  The most important part
<router-outlet />

Think of router-outlet as an empty space where Angular puts the currently selected page.

For example:

                    AppComponent
                         │
             ┌───────────┴───────────┐
             │                       │
          Navbar                 router-outlet
                                     │
                    ┌────────────────┼───────────────┐
                    ↓                ↓               ↓
                 Home page       Detail page      Not found

## Our architecture is
src/
└── app/
    │
    ├── app.component.ts
    ├── app.component.html
    ├── app.component.css
    │
    ├── app.config.ts
    ├── app.routes.ts
    │
    ├── core/
    │   ├── models/
    │   │   └── stay.model.ts
    │   │
    │   └── services/
    │       └── stays.service.ts
    │
    ├── pages/
    │   │
    │   ├── stays-list/
    │   │   ├── stays-list.component.ts
    │   │   ├── stays-list.component.html
    │   │   └── stays-list.component.css
    │   │
    │   ├── stay-detail/
    │   │   ├── stay-detail.component.ts
    │   │   ├── stay-detail.component.html
    │   │   └── stay-detail.component.css
    │   │
    │   └── not-found/
    │       ├── not-found.component.ts
    │       ├── not-found.component.html
    │       └── not-found.component.css
    │
    └── shared/
        │
        ├── components/
        │   ├── stay-card/
        │   │   ├── stay-card.component.ts
        │   │   ├── stay-card.component.html
        │   │   └── stay-card.component.css
        │   │
        │   ├── badge/
        │   ├── card-shell/
        │   └── footer/
        │
        ├── directives/
        │   └── highlight-card.directive.ts
        │
        └── pipes/
            └── truncate.pipe.ts

##  Service
We have two different pages for StaysListComponent and for StayDetailComponent:

StaysListComponent
        │
        │ needs stays
        ↓
   StaysService
        ↑
        │ needs stays
        │
StayDetailComponent

Both components need access to the same data.

Why is that useful for favorites?

Imagine the user is on:

/stays/1

and clicks the favorite button.

The service changes:

favoriteIds

Then the user goes back to:

/

The list page can ask the same service:

isFavorite(1)

and see that the stay is still favorited.

We therefore don't have:

List page
favoriteIds = [...]

Detail page
favoriteIds = [...]

which would create two separate states.

Instead:

StaysService
             /          \
            /            \
           ↓              ↓
       List page      Detail page
           \              /
            \            /
             same state

## Pages

stays-list page:

The flow is
StaysService
     ↓
StaysListComponent
     ↓
StayCardComponent
     ↓
user clicks favorite
     ↓
favorited event
     ↓
StaysListComponent
     ↓
StaysService
     ↓
favorite state updated

## How the complete application works

The final architecture is:

                         Browser
                            │
                            ↓
                      Angular Router
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ↓              ↓              ↓
            "/"       "/stays/:id"      "/**"
             │              │              │
             ↓              ↓              ↓
       StaysList        StayDetail      NotFound
       Component        Component      Component
             │              │
             │              │
             └──────┬───────┘
                    ↓
              StaysService
                    │
             ┌──────┴──────┐
             │             │
          stays        favoriteIds