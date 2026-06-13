# Auth API — Production TODO

## Critical

- [ ] **Rate limit login** — `express-rate-limit`, 5 attempts/min per IP
- [ ] **Fix login validator** — uses `registerSchema` instead of `loginSchema`, locks out users with older passwords
- [ ] **Constrain JWT algorithm** — `jwt.verify(token, secret, { algorithms: ['HS256'] })` everywhere
- [ ] **Stop leaking error messages** — return generic "Internal server error", log real error server-side
- [ ] **Refresh token rotation** — on each refresh, delete old token, issue new one; detect reuse (theft)
- [ ] **SameSite cookie** — set `sameSite: 'strict'` on refresh token cookie

## High

- [ ] **Security headers** — `helmet` middleware (CSP, HSTS, X-Frame-Options, etc.)
- [ ] **CORS** — configure allowed origins
- [ ] **Audit logging** — log login/register/refresh/logout with timestamp + IP
- [ ] **Prevent user enumeration** — return generic message on duplicate register
- [ ] **Email verification** — verify ownership before allowing login
- [ ] **Password reset** — forgot password flow
- [ ] **Access token revocation** — blocklist or `tokenVersion` column

## Medium

- [ ] **DB connection SSL** — `?sslmode=require` in production DATABASE_URL
- [ ] **Morgan format** — switch to `"combined"` in production, avoid logging bodies
- [ ] **Consistent refresh response** — return `{ success: true, data: { accessToken } }` envelope
- [ ] **Request body size limit** — `express.json({ limit: '10kb' })`
- [ ] **Clear cookie with same options** — pass `httpOnly`, `secure`, `sameSite` to `res.clearCookie()`
- [ ] **Trim + lowercase email** before storage and comparison
- [ ] **Index on `refresh_tokens.user_id`**

## Low

- [ ] **Graceful shutdown** — handle SIGTERM/SIGINT, drain server + DB pool
- [ ] **Remove unused `login.validator.ts`** or wire it up
- [ ] **Remove `express.urlencoded()`** since this is a JSON-only API
