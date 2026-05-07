# Promo Aggregator

Scrapes promotions from a single mall portal, persists them, and serves them
via a typed REST API with a browsable UI.

## Prerequisites
- Node.js 20+
- Docker + Docker Compose (optional, for containerized run)

## Local setup (without Docker)

1. Clone the repo
   git clone https://github.com/tesddev/promo-aggregator.git
   cd promo-aggregator

2. Copy env file
   cp .env.example .env

3. Install dependencies
   npm install

4. Start the API
   npm run dev:api

5. In a second terminal, start the UI
   npm run dev:web

6. Trigger a scrape (in a third terminal)
   curl -X POST http://localhost:4000/scrape

7. Open the UI
   http://localhost:3000

## Local setup (with Docker)

   cp .env.example .env
   docker-compose up --build

Then trigger a scrape:
   curl -X POST http://localhost:4000/scrape

## API endpoints

GET  /promotions          paginated list, supports ?search, ?brand, ?page, ?pageSize
GET  /promotions/:id      single promotion
GET  /brands              all brands with promotionCount
POST /scrape              trigger a fresh scrape (synchronous, takes 2-5 min)

## Environment variables

See .env.example. Key vars:
- PORT            API port (default 4000)
- DATABASE_PATH   Path to SQLite file (default ./data/promos.db)
- SCRAPE_DELAY_MS Delay between scraper requests in ms (default 600)

## Known limitations
- Scraper reads page 1 of /sales only
- CSS selectors may need updating if the site structure changes
- POST /scrape is synchronous and blocks for the duration of the scrape