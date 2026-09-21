## Homework 6 — Nestly gets accounts: login, roles and token refresh

# Final project structure

src/app/
│
├── app.config.ts
├── app.routes.ts
├── app.component.ts
├── app.component.html
│
├── core/
│   │
│   ├── models/
│   │   ├── auth.model.ts             NEW
│   │   ├── stay.model.ts
│   │   └── new-stay.model.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts           NEW
│   │   └── stays.service.ts
│   │
│   ├── store/
│   │   ├── auth.store.ts             NEW
│   │   ├── stays.store.ts
│   │   └── stay-search.feature.ts
│   │
│   ├── guards/
│   │   ├── auth.guard.ts             NEW
│   │   └── admin.guard.ts            NEW
│   │
│   └── interceptors/
│       └── auth.interceptor.ts       NEW
│
├── pages/
│   │
│   ├── login/
│   │   ├── login.component.ts        NEW
│   │   ├── login.component.html      NEW
│   │   └── login.component.css       NEW
│   │
│   ├── register/
│   │   ├── register.component.ts     NEW
│   │   ├── register.component.html   NEW
│   │   └── register.component.css    NEW
│   │
│   ├── admin/
│   │   ├── admin.component.ts        NEW
│   │   └── admin.component.html      NEW
│   │
│   ├── not-allowed/
│   │   ├── not-allowed.component.ts  NEW
│   │   └── not-allowed.component.html NEW
│   │
│   ├── host-new/
│   ├── stays-list/
│   ├── stay-detail/
│   └── not-found/
│
└── shared/
    └── components/
        └── navbar/
            ├── navbar.component.ts
            └── navbar.component.html

Order:

1. Create AuthModel
src/app/core/models/auth.model.ts

2.  Create AuthService
src/app/core/services/auth.service.ts

3. Create AuthStore
src/app/core/store/auth.store.ts

4. Create Functional authGuard
src/app/core/guards/auth.guard.ts

5. Create the adminGuard
src/app/core/guards/admin.guard.ts

6. Create the auth interceptor
src/app/core/interceptors/auth.interceptor.ts

7. Update app.config.ts

8. Create Login page
src/app/pages/login/login.component.ts
src/app/pages/login/login.component.html
src/app/pages/login/login.component.css

9. Create Register page
src/app/pages/register/register.component.ts
src/app/pages/register/register.component.html
src/app/pages/register/register.component.css

10. Create Not Allowed page
src/app/pages/not-allowed/not-allowed.component.ts
src/app/pages/not-allowed/not-allowed.component.html

11. Create Admin page
src/app/pages/admin/admin.component.ts
src/app/pages/admin/admin.component.html

12. Add deleteStay() to the existing StayService

13. Update the  routes in app.routes.ts adding login, register, not-allowed plus authGuard, adminGuard

14. Update Navbar so taht it has authentication state
src/app/shared/components/navbar/navbar.component.ts
src/app/shared/components/navbar/navbar.component.html
src/app/shared/components/navbar/navbar.component.css

15. Change app.component.ts (the authentication logic lives in the Navbar)











