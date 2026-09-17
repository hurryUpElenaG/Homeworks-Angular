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


## "What does your StaysStore do?"

You could explain it like this:

"StaysStore is a root-level Signal Store that manages all the state needed by the stays list. withState stores the stays, loading state and error. withStaySearch provides the search and superhost filter state. withComputed creates derived values such as the number of stays and whether results exist. withMethods defines loadStays, which uses rxMethod and the StaysService to load data from the backend. patchState is used for every state update. withHooks calls loadStays when the store initializes, and because loadStays receives the reactive query signal, it reloads when the search or superhost filter changes. withDevtools allows the store state to be inspected during development."

The easiest mental model

Think of your store as a central manager:

                 StaysStore
                     │
       ┌─────────────┼─────────────┐
       │             │             │
     DATA          FILTERS       ACTIONS
       │             │             │
    stays          search       loadStays()
    loading        superhost
    error          query
       │             │             │
       └─────────────┼─────────────┘
                     │
                     ▼
                Angular HTML

And the four main NgRx concepts are:

Concept	                Simple meaning
withState()	            What data do I store?
withComputed()	        What can I calculate from the data?
withMethods()	          What can my store do?
rxMethod()	            How do I handle reactive/async operations such as HTTP?
withHooks()	            What should happen when the store starts?
patchState()	          How do I change the state?
withStaySearch()	      Can I extract search/filter logic into a reusable feature?
withDevtools()	        How can I inspect the store while developing?

The single most important distinction to remember is: withState holds the source data, withComputed calculates values from that data, and withMethods changes/works with the data. patchState is the mechanism used to perform those state changes.


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



