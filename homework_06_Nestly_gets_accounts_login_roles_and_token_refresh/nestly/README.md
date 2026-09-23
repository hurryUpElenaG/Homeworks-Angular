## Homework 6 — Nestly gets accounts: login, roles and token refresh

# Order of creating files for Homework 6:

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


# The easiest way to understand Homework 6 is to see it as one authentication system:

                    ┌─────────────────┐
                    │ Login/Register  │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   AuthStore     │
                    │ user + tokens   │
                    └────────┬────────┘
                             ↓
                       localStorage
                             ↓
                    ┌─────────────────┐
                    │ AuthInterceptor │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   NestJS API    │
                    └─────────────────┘



And when the access token expires:

Angular request
      ↓
    401
      ↓
AuthInterceptor
      ↓
refresh token
      ↓
new access token + new refresh token
      ↓
save them in AuthStore
      ↓
retry original request
      ↓
success


## The entire application flow

Now let's put everything together.

Login

User enters:

user@nestly.dev
password123

Then:

LoginComponent
      ↓
store.login()
      ↓
AuthService.login()
      ↓
POST /api/auth/login
      ↓
NestJS
      ↓
user + accessToken + refreshToken
      ↓
AuthStore
      ↓
localStorage
      ↓
/

## Expired token

After 60 seconds:

access token expired

User submits form:

POST /api/stays
      ↓
401

Interceptor:

401
 ↓
refreshToken
 ↓
POST /api/auth/refresh
 ↓
new accessToken
new refreshToken
 ↓
save tokens
 ↓
retry POST /api/stays
 ↓
success

This is the main feature of Homework 6.

## Admin authorization

Admin:

login
 ↓
role = ADMIN
 ↓
isAdmin() = true
 ↓
/admin allowed
 ↓
DELETE /api/stays/:id
 ↓
server checks role
 ↓
delete

Normal USER:

login
 ↓
role = USER
 ↓
isAdmin() = false
 ↓
/admin
 ↓
/not-allowed

Even if someone somehow bypassed the Angular guard and manually sent:

DELETE /api/stays/5

the backend still protects the endpoint and returns:

403 Forbidden

That distinction is important:

Angular guards protect navigation in the frontend. The NestJS backend protects the actual data/API.

## Architecture of Homework 6
one diagram I'd memorize
                     LOGIN
                       │
                       ▼
               ┌──────────────┐
               │ AuthService  │
               └──────┬───────┘
                      HTTP
                       │
                       ▼
                ┌────────────┐
                │ NestJS API │
                └─────┬──────┘
                      │
             user + tokens
                      │
                      ▼
               ┌────────────┐
               │ AuthStore  │
               └─────┬──────┘
                     │
              ┌──────┴──────┐
              ▼             ▼
          Signals       localStorage
              │
              ▼
        Navbar / Guards
              │
              ▼
          HttpClient
              │
              ▼
       AuthInterceptor
              │
       ┌──────┴───────┐
       │              │
     token          expired
       │              │
       ▼              ▼
     API       /auth/refresh
                      │
                      ▼
                new tokens
                      │
                      ▼
                 retry request

## 10 points to remeber for summarizing Homework 6
1. AuthService
Makes HTTP calls to /auth/*

It doesn't manage authentication state.

2. AuthStore
Stores user + access token + refresh token

and provides:

isLoggedIn()
isAdmin()

3. localStorage
Keeps authentication information after browser refresh.

4. authGuard
Protects routes that require login.

5. adminGuard
Protects routes that require ADMIN role.

6. Interceptor
Automatically adds:

Authorization: Bearer <token>

to HTTP requests.

7. 401
Access token expired/invalid
        ↓
try refresh

8. 403
User is authenticated
but doesn't have permission.

For example:

USER tries DELETE
        ↓
403

9. Refresh token rotation

When /auth/refresh succeeds:

old access token   → replace
old refresh token  → replace

You must save the new refresh token.

10. Signals

Instead of subscriptions:

@if (store.isLoggedIn()) {

and:

@if (store.isAdmin()) {

Angular automatically reacts to changes in the AuthStore.


# Bonus: returnUrl

The idea is:

User tries /host/new
        ↓
authGuard
        ↓
not logged in
        ↓
/login?returnUrl=/host/new
        ↓
user logs in
        ↓
/host/new


# Bonus: Refresh request queue

This is the more advanced bonus.

Without the bonus, imagine the access token expires.

Three requests happen almost simultaneously:

Request A → 401
Request B → 401
Request C → 401

     ↓
   
Refresh A
Refresh B
Refresh C

That's bad because we don't need three refresh requests.

With the bonus:

Request A → 401 ─┐
Request B → 401 ─┼──→ ONE refresh request
Request C → 401 ─┘
                     ↓
                new tokens
                     ↓
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     retry A      retry B      retry C

We can use shareReplay() for this.


## 10. Final bonus architecture

After all changes, your Homework 6 flow becomes:

                    Angular Component
                           │
                           ▼
                     AuthStore
                           │
                           ▼
                     AuthService
                           │
                           ▼
                       HttpClient
                           │
                           ▼
                  authInterceptor
                           │
                           ▼
                    NestJS Server

If the access token is valid:

Request
  ↓
Interceptor
  ↓
Bearer token
  ↓
Server
  ↓
Response

If the access token expired:

Request
  ↓
Interceptor
  ↓
401
  ↓
Is refresh already running?
  │
  ├── NO ──→ Start refresh
  │
  └── YES ─→ Wait for existing refresh
                   ↓
              New tokens
                   ↓
              Save tokens
                   ↓
             Retry request

And if three requests receive 401 simultaneously:

A ──┐
B ──┼──→ ONE refresh() ──→ new token ──┬→ retry A
C ──┘                                  ├→ retry B
                                       └→ retry C










