# CODEX CONTEXT — Allegro integration project

## Project identity

- Owner: Dmitry Nicheperovich
- GitHub account/organization previously used: `polmechtech`
- Main repository discussed: `polmechtech/trendeco-landing`
- Earlier related repository: `polmechtech/polmech`
- Stack: Next.js 16.x, TypeScript, Tailwind CSS, Vercel
- Primary purpose: public product landing page plus internal Allegro offer management panel.

## Current critical problem

The application previously returned:

```text
{"error":"Server crash","details":"Token error 400: {\"error_description\":\"Invalid refresh token: ...
```

The Allegro OAuth refresh token is invalid or expired/revoked.

The last confirmed git state from the user's Mac was:

```text
f930c0e (HEAD -> main, origin/main) Add Redis lock for Allegro token refresh
```

The repository was pushed and local `main` matched `origin/main`.

## Allegro account and OAuth

- Allegro account used for integration: `trendeco_eu`
- OAuth model: Authorization Code flow with refresh token.
- The application must not rely on a permanently hard-coded access token.
- Refresh token rotation must be handled correctly.
- Only one process should refresh the token at a time.
- Redis locking was introduced to prevent concurrent token refreshes.
- Tokens should be stored persistently and atomically.
- A successful refresh may return a new refresh token; it must replace the old one.
- Environment secrets must never be committed.

Expected environment variables may include equivalents of:

```env
ALLEGRO_CLIENT_ID=
ALLEGRO_CLIENT_SECRET=
ALLEGRO_REDIRECT_URI=
ALLEGRO_ACCESS_TOKEN=
ALLEGRO_REFRESH_TOKEN=
REDIS_URL=
```

Codex must inspect the actual code and use the existing naming conventions rather than blindly adding duplicates.

## Main required functionality

### Public site

A one-page site that displays selected Allegro offers.

Planned domain:

```text
trendeco.eu
```

Product categories discussed:

- Meblarstwo
- Budownictwo
- Łuparki
- Akcesoria

Examples of subcategories:

- Piły formatowe
- Okleiniarki
- Piły pierścieniowe
- Prowadnice
- Przecinarki 230 V / 400 V
- Łuparki 230 V / 400 V
- Noże
- Płytki
- Frezy nasadzane
- Frezy trzpieniowe
- Wały spiralne

The public site should show only selected offers, not every Allegro listing.

### Internal admin panel

Previously discussed route:

```text
/admin/config
```

Required operations:

- list selected Allegro offers;
- fetch offer title, image, price, stock, publication status and URL;
- edit price;
- edit quantity;
- push permitted changes to Allegro;
- allow/disallow pushing per offer;
- pin offers;
- sort offers;
- add internal notes;
- remove an offer from the selected list;
- add an offer by Allegro offer ID;
- show synchronization errors clearly;
- prevent accidental mass updates;
- support manual synchronization;
- later support scheduled synchronization.

Previously discussed local data file:

```text
data/selected-offers.json
```

Possible fields mentioned:

```ts
type SelectedOffer = {
  offerId: string;
  note?: string;
  allowPush?: boolean;
  pinned?: boolean;
  sortOrder?: number;
};
```

Codex must inspect the repository and preserve the existing schema if it differs.

## Synchronization behavior

- Synchronize only selected offers.
- Pull current data from Allegro before displaying it.
- Never overwrite Allegro data merely because local cached data is stale.
- Price and quantity updates must be explicit and validated.
- Add logging for:
  - token refresh;
  - Allegro API errors;
  - failed offer fetches;
  - failed price updates;
  - failed stock updates;
  - Redis lock acquisition/release.
- Do not log secrets or full tokens.
- Add retry only for safe transient failures.
- Do not retry invalid OAuth credentials indefinitely.
- Use a configurable interval such as `SYNC_INTERVAL_MS` if scheduled synchronization already exists.
- Vercel serverless execution must be considered; do not rely on an in-memory timer for durable scheduling.

## Immediate Codex task

1. Inspect the complete repository.
2. Identify every Allegro OAuth and token-storage file.
3. Trace the exact cause of `Invalid refresh token`.
4. Check whether:
   - the old refresh token is reused after rotation;
   - multiple Vercel instances refresh simultaneously;
   - Redis lock expires too early;
   - token writes are non-atomic;
   - development and production use different credentials;
   - redirect URI differs from the Allegro application settings;
   - sandbox and production Allegro endpoints are mixed;
   - refresh errors overwrite a valid stored token;
   - environment variables override persistent token storage.
5. Repair the OAuth flow.
6. Add a protected endpoint or admin action to start a fresh OAuth authorization.
7. Add clear setup instructions to `README.md`.
8. Add `.env.example` containing variable names only.
9. Verify locally with:
   - lint;
   - typecheck;
   - build;
   - relevant tests.
10. Do not deploy or change production secrets without explicit approval.

## OAuth acceptance criteria

- A fresh authorization can be initiated.
- The callback exchanges the authorization code successfully.
- Access and refresh tokens are persisted.
- Expired access tokens refresh automatically.
- A rotated refresh token is saved and used on the next refresh.
- Concurrent refresh attempts do not invalidate each other.
- An invalid refresh token produces an actionable admin message instead of a generic server crash.
- The public product page remains available even if Allegro temporarily fails, using safe cached data where appropriate.
- Secrets never appear in logs, browser output or git.

## Security requirements

- Protect `/admin/*` routes.
- Protect OAuth callback/state against CSRF using a cryptographically random `state`.
- Use secure, HTTP-only cookies when cookies are used.
- Validate all offer IDs, prices and quantities.
- Price must be positive and use correct decimal precision.
- Quantity must be a non-negative integer.
- Never expose `client_secret`, access token or refresh token to client-side JavaScript.
- Rate-limit sensitive admin actions where practical.
- Do not commit real customer, order, token or credential data.

## Suggested repository files to inspect

Search for:

```text
allegro
oauth
refresh_token
access_token
client_id
client_secret
REDIS
token
selected-offers
SYNC_INTERVAL_MS
/admin/config
api/allegro
callback
authorize
```

Likely locations include:

```text
app/api/
src/app/api/
lib/
src/lib/
data/
app/admin/
src/app/admin/
```

These are hints only; inspect the actual tree.

## Required output from Codex

Codex should report:

1. Root cause.
2. Files changed.
3. Security implications.
4. Environment variables required.
5. Exact local test commands.
6. Any manual action required in the Allegro developer portal.
7. Any manual action required in Vercel.
8. Remaining risks.

## Important constraints

- Do not rebuild the entire application from scratch.
- Preserve existing working UI and offer selection logic.
- Make the smallest reliable fix first.
- Do not invent Allegro API fields; verify against current official Allegro API documentation.
- Do not delete Redis locking until concurrency behavior is fully understood.
- Do not store tokens only in process memory.
- Do not create duplicate OAuth implementations.
- Do not modify prices or stock on the live Allegro account during testing without explicit approval.

## User's expected next stage

After OAuth is repaired:

1. restore selected Allegro offers on the public page;
2. finish `/admin/config`;
3. add safe bulk price editing;
4. add stock synchronization;
5. add sales and views statistics;
6. add rule-based price automation;
7. complete deployment for `trendeco.eu`.

## Starting instruction for Codex

Read this file first, then inspect the repository before making changes. Do not assume the description perfectly matches the current code. Treat the repository as the source of truth and use this document as project history and acceptance criteria.
