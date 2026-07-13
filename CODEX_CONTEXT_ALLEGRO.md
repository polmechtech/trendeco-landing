# CODEX CONTEXT — Allegro offer mirror

## Final product scope

The application has one narrow purpose:

1. Import selected offers from Allegro to the public site.
2. Show current offer data on the public site.
3. Synchronize price and available stock from Allegro every hour.
4. Send every buyer to Allegro to complete the purchase.

The website is not an independent store.

## What the site must display

For each selected Allegro offer:

- title;
- main image;
- current price;
- current available quantity or availability status;
- Allegro offer URL;
- button such as `Kup na Allegro`.

The button must open the corresponding Allegro offer. No checkout, cart, payment, order creation or customer account is required on the website.

## Source of truth

Allegro is the only source of truth for:

- price;
- available quantity;
- publication status;
- offer URL;
- title and image unless there is already a deliberate local override.

Synchronization is one-way:

```text
Allegro -> website
```

The website must not push prices, quantities or offer edits back to Allegro.

## Offer selection

The application should support a simple list of selected Allegro offer IDs.

Existing file discussed earlier:

```text
data/selected-offers.json
```

A minimal valid structure is enough, for example:

```json
[
  { "offerId": "123456789" }
]
```

Preserve the existing repository schema if one already exists.

A minimal protected admin/config screen may be retained only to:

- add an Allegro offer ID;
- remove an Allegro offer ID;
- trigger manual refresh;
- see last synchronization time and errors.

Do not build price editing, stock editing, bulk updates, CRM, order handling, analytics, competitor monitoring or rule-based pricing.

## Hourly synchronization

Synchronization must run once per hour.

Requirements:

- use a durable scheduler suitable for Vercel/serverless deployment;
- do not use an in-memory `setInterval` as the only scheduler;
- a Vercel Cron endpoint or equivalent scheduled job is acceptable;
- protect the cron endpoint with a secret;
- fetch only selected offers;
- update the cached public data atomically;
- record `lastSuccessfulSyncAt`;
- keep the last valid cached data when Allegro is temporarily unavailable;
- log errors without exposing tokens or secrets;
- avoid overlapping synchronization jobs with a Redis lock or equivalent lock if Redis is already used.

Target frequency:

```text
0 * * * *
```

This means once at the start of every hour. Exact implementation must match the hosting platform.

## Allegro OAuth

Allegro account used previously:

```text
trendeco_eu
```

Current known failure:

```text
Invalid refresh token
```

The OAuth implementation must be repaired before synchronization can work.

Required behavior:

- Authorization Code flow;
- persistent token storage;
- correct refresh-token rotation;
- one refresh operation at a time;
- successful refresh must save the newest refresh token;
- invalid refresh token must produce a clear action to authorize Allegro again;
- secrets must remain server-side;
- never log complete access or refresh tokens.

The last known related commit before this context file was added:

```text
f930c0e Add Redis lock for Allegro token refresh
```

Inspect the repository instead of assuming this implementation is correct.

## Public-site behavior

The public product listing must:

- render from safe cached data;
- remain available during a temporary Allegro API failure;
- show only active selected offers, or clearly mark an unavailable offer;
- link directly to Allegro;
- contain no local basket or checkout;
- contain no local stock reservation;
- contain no local order processing.

A sale happens entirely on Allegro.

## Immediate Codex task

1. Read the complete repository.
2. Find all Allegro OAuth, token, Redis, offer-fetch and synchronization code.
3. Identify the exact reason for `Invalid refresh token`.
4. Repair OAuth with correct token rotation and persistent storage.
5. Implement or repair import of selected Allegro offers.
6. Store a safe cached representation of selected offers for the public page.
7. Add hourly scheduled synchronization.
8. Add a protected manual synchronization endpoint or admin button.
9. Ensure every product button links to the Allegro offer.
10. Remove or ignore unnecessary planned functionality outside this scope.
11. Run lint, typecheck and production build.
12. Do not change live Allegro data.

## Acceptance criteria

- A new Allegro authorization can be completed.
- Tokens persist across deployments and serverless invocations.
- Rotated refresh tokens are saved correctly.
- Selected offers appear on the public page.
- Price shown on the site matches Allegro after synchronization.
- Available quantity or availability status matches Allegro after synchronization.
- Synchronization runs automatically every hour.
- Manual synchronization works for an authorized administrator.
- Temporary Allegro errors do not blank the site.
- Every purchase button sends the buyer to Allegro.
- The site has no cart, checkout, payment or order-management system.
- The website never modifies Allegro price or stock.

## Out of scope

Do not implement:

- local checkout;
- local payments;
- local orders;
- customer accounts;
- CRM;
- warehouse management;
- editing Allegro prices;
- editing Allegro stock;
- automatic repricing;
- competitor monitoring;
- sales statistics;
- views statistics;
- Telegram alerts;
- marketplace expansion;
- eBay, eMAG or Amazon integration;
- large architectural rewrite.

## Security

- Protect admin and manual sync routes.
- Protect cron endpoint with a secret.
- Validate offer IDs.
- Keep client secret and Allegro tokens server-side.
- Never commit real credentials.
- Never expose tokens in browser responses or logs.
- Use cryptographic OAuth `state` validation.

## Required Codex report

After implementation, report:

1. root cause of the OAuth failure;
2. files changed;
3. token storage method;
4. hourly scheduler implementation;
5. cache storage method;
6. environment variables required;
7. Allegro developer-portal actions required;
8. Vercel actions required;
9. exact test commands;
10. remaining risks.

## Starting instruction

Read this file first, then inspect the repository. Implement the smallest reliable solution that mirrors selected Allegro offers and refreshes price and stock hourly. Allegro remains the only sales channel and checkout destination.
