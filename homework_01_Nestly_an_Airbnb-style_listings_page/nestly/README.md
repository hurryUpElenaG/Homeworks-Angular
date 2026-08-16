# Nestly

## How all the pieces now connect

## Your final Nestly application is essentially:

                    AppComponent
                         │
          ┌──────────────┼──────────────┐
          │              │              │
     NavbarComponent   StayCard       FooterComponent
                         │
                         │
                  CardShellComponent
                         │
              ┌──────────┴──────────┐
              │                     │
           Stay data             Badge
                                    │
                              ng-content

## And the important homework flow is:

AppComponent
     │
     │ [stay]="stay"
     ▼
StayCardComponent
     │
     │ user clicks ♥
     │
     │ favorited.emit(...)
     ▼
AppComponent
     │
     ▼
onFavorited($event)