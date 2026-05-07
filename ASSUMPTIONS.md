# Assumptions

- Brand directory URLs follow the pattern /directory/{brand-slug}. If a brand
  slug doesn't resolve, brand enrichment fields fall back to null and the
  promotion is still saved.

- Dates scraped from the site are unstructured text strings. They are stored
  as-is (TEXT in SQLite, string in TypeScript). No date parsing is attempted
  unless the format is reliably consistent.

- If a promotion has no detectable brand name, it is skipped and logged — not
  saved with a blank brand.

- Social links: only links explicitly present in the DOM are captured. If none
  exist, socialLinks fields are null, not empty strings.

- The scraper targets the first page of /sales only. If the site paginates
  promotions, pages 2+ are not scraped in this version.

- Re-running POST /scrape updates existing records via INSERT OR REPLACE.
  It does not delete promotions that have been removed from the site since
  the last scrape.