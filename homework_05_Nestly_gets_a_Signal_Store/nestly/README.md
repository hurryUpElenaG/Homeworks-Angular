## Homework 5 — Signal Store (Nestly get signal store)

# How the architecture works now without Bonus:

Previously your application looked approximately like this:

StaysListComponent
       │
       ├── stays
       ├── isLoading
       ├── error
       ├── search
       ├── superhostOnly
       │
       └── StaysService
                │
                └── HTTP

Now it becomes:

             StaysListComponent
                    │
                    │ reads/calls
                    ▼
                StaysStore
                    │
       ┌────────────┼─────────────┐
       │            │             │
     state       computed       methods
       │            │             │
       │         count()      setSearch()
       │         hasResults() toggleSuperhostOnly()
       │                         loadStays()
       │                             │
       │                             ▼
       │                       StaysService
       │                             │
       │                             ▼
       │                           HTTP
       │
       ├── stays
       ├── isLoading
       ├── error
       ├── search
       └── superhostOnly

This is the main point of Homework 5.

# How architecture works with Bonus
        StaysListComponent
            │
            │ reads/calls
            ▼
          StaysStore stays.store.ts
            │
            ├── withState()
            │     ├── stays
            │     ├── isLoading
            │     └── error
            │
            ├── withStaySearch()  is essentially a reusable piece of SignalStore functionality.
            │     │
            │     ├── search
            │     ├── superhostOnly
            │     ├── query
            │     ├── setSearch()
            │     └── toggleSuperhostOnly()
            │
            ├── withComputed()
            │     ├── count
            │     └── hasResults
            │
            ├── withMethods()
            │     └── loadStays()
            │
            ├── withDevtools()
            │
            └── withHooks()
                  └── initial load

            
            
            stay-search.feature.ts
            │
            └── withStaySearch()



## Why providedIn: 'root' matters

This:

export const StaysStore = signalStore(
  { providedIn: 'root' },

means Angular provides one root-level instance of the store.

For example:

Home page
   ↓
StaysStore
   ↓
stays loaded

Navigate → Stay Details

Navigate ← Home page

StaysStore
   ↓
same store instance
   ↓
previous stays still exist

The component itself can be destroyed when you navigate away.

But the root store isn't destroyed just because the page component disappears.

That's why the stays state can survive navigation.

# Order of completing the task:
1. Install NgRx Signals
ng add @ngrx/signals

2. Create stays.store.ts: 
src/app/core/store/stays.stores.ts

3. Replace stays-list.component.ts
src/app/pages/stays-list/stays-list.component.ts
The only remaining local functionality is favorites because your homework specifically moves stays/loading/search/filter into the store. Your existing StaysService still owns the client-side favorite IDs.

4. Replace stays-list.component.html
src/app/pages/stays-list/stays-list.component.html

The current HTML doesn't have a search box, but Homework 5 specifically requires server-side searching, that is why stays-list.component.html is replaced with new version.

5. Update the CSS
src/app/pages/stays-list/stays-list.component.css

The existing CSS can stay almost exactly the same.
I would only add styling for the search field and count.

#Bonus
6. Install store detools
npm install @angular-architects/ngrx-toolkit  for angular21

7. Implement withStaySearch() in stay-search.feature.ts
src/app/core/stores/stay-search.feature.ts



