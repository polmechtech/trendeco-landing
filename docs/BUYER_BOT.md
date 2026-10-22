# TrendEco Buyer Bot — operational status

This repository includes two scheduled GitHub Actions jobs:
- Technical discoverability checks of trendeco.eu, polmech.tech and widia.tech.
- Search Console CSV query prioritization, producing review-only Polish content briefs.

## Enabling real query analysis
Export Search Console **Performance > Search results > Queries** as CSV.
Save as `data/gsc_queries.csv` in the repository (avoid including personal data).
The next run analyzes real impressions, clicks and positions. Without the CSV,
the job explicitly reports missing data rather than inventing demand.

## Guardrails
- No automated changes to prices, listings, or any Allegro account.
- In particular, the Allegro TRENDECO account is excluded.
- Generated briefs are not published automatically.
- This is organic SEO monitoring and planning, not direct outreach to individuals.
- GitHub scheduled jobs run on the default branch; merging the PR is required.
- Future integrations: authorized GSC API access, reviewed content publishing and conversion analytics.
