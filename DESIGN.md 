# Design Notes

## Scraping approach
Playwright with headless Chromium. The site checks headers and handles redirects
in ways that break naive fetch() calls. A real browser context sidesteps that cleanly.
Politeness: 600ms delay between requests, real Chrome user-agent string.

## Schema
Two tables: `brands` and `promotions`. Promotions hold a `brandId` foreign key.
Brand data is normalized — hours, socials, website exist once per brand, not
duplicated across every promotion row. This is the right call because multiple
promotions share one brand.

## Missing data strategy
All optional fields are explicitly `null`. Never `undefined`, never empty string.
Consistent across scraper, DB, API response, and UI rendering.

## POST /scrape — sync vs async
Synchronous. Async would need a job queue (Bull + Redis), which is out of scope
for a single-portal MVP. The request blocks until the scrape finishes. The API
is otherwise unaffected because the scrape runs in its own process context.

## Dedup strategy
Stable ID = MD5 hash of the promotion's canonical URL. Re-scraping uses
INSERT OR REPLACE so existing records are updated, not duplicated.

## What I cut for time
- Detail click-through page in the UI
- Async scrape with job status polling