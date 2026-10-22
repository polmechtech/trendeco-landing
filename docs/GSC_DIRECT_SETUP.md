# Direct Google Search Console API setup (free)

1. Open https://console.cloud.google.com/ and select or create a Google Cloud project.
2. Enable **Google Search Console API** in APIs & Services > Library.
3. In IAM & Admin > Service Accounts, create a service account.
4. Create a JSON key for that service account. Keep it private; never commit or send it in chat.
5. In https://search.google.com/search-console, open **Settings > Users and permissions > Add user** for each property. Add the service account email with **Full** permission (or the least permission that permits API reads). You must be a verified owner to add users.
6. In GitHub repository `polmechtech/trendeco-landing` open **Settings > Secrets and variables > Actions > New repository secret**. Name: `GSC_SERVICE_ACCOUNT_JSON`. Paste the entire JSON key.
7. Optional: if the property is a URL-prefix property rather than domain property, add GitHub Actions repository variables `GSC_SITE_TRENDECO`, `GSC_SITE_POLMECH`, `GSC_SITE_WIDIA` with the **exact** property identifiers from Search Console (for example `https://trendeco.eu/`). Otherwise the defaults are `sc-domain:trendeco.eu`, `sc-domain:polmech.tech`, `sc-domain:widia.tech`.
8. In GitHub **Actions > TrendEco direct Search Console data > Run workflow** to test. The scheduled job then runs daily. Download the `direct-gsc-analysis` artifact to view results.

The bot only reads Search Console metrics and generates reports. It does not edit product offers, publish to sites, or access Allegro TRENDECO. Data may lag several days. The script deliberately does not upload raw query CSV to a public repository.
