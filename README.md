Lift Log React Frontend

A Vite + React SPA with a Netlify function API backed by MongoDB.

## Running locally

```
npm install
npm run dev:netlify   # serves the SPA and the function together on :8888
```

`npm run dev` alone serves only the SPA, which leaves every API call
unanswered — including sign-in.

## Authentication

Everything is private: no board is readable signed out. Sign-in is Google
only, through [Better Auth](https://www.better-auth.com), whose routes the
Netlify function serves under `/api/auth`.

- Anyone who signs in can read the logs and add, edit and delete entries.
- The **master admin** — designated by the `SUPERUSER_EMAIL` environment
  variable, comma-separated, never by a database flag — additionally creates,
  renames and deletes whole logs.

Copy `.env.example` to `.env` and fill it in. In the Google Cloud console,
add `<BETTER_AUTH_URL>/api/auth/callback/google` as an authorized redirect
URI. `BETTER_AUTH_URL` must match the origin the app is served from, dev port
included.

`/api/healthcheck` stays open so uptime probes keep working; it reports only
whether the database answers.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev:netlify` | SPA + function, the way it runs in production |
| `npm run build` | Typecheck, then build the SPA into `dist` |
| `npm run typecheck` | Typecheck the SPA and the function |
| `npm run lint` | ESLint |
| `npm test` | Unit tests |
| `npm run test:integration` | Repository tests against a local MongoDB replica set |
