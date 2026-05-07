# Promo Aggregator

Scrape promotions from a shopping mall portal, store them in SQLite, and serve them through a clean typed REST API with a responsive frontend.

## Features

- Full-stack TypeScript monorepo
- Playwright-powered scraper with polite delays
- Normalized SQLite database (Brands + Promotions)
- REST API with filtering, search, and pagination
- Modern Next.js UI with "Group by Brand" view
- Docker support

## Prerequisites

- Node.js 20+
- Yarn (recommended) or npm
- Docker + Docker Compose (optional)

## Local Setup (Recommended)

### 1. Clone & Install

```bash
git clone https://github.com/tesddev/promo-aggregator.git
cd promo-aggregator
cp .env.example .env
yarn install
```

### 2. Start Development Servers

**Terminal 1** — Start the API:
```bash
yarn dev:api
```

**Terminal 2** — Start the Frontend:
```bash
yarn dev:web
```

### 3. Trigger Scrape

```bash
curl -X POST http://localhost:4000/scrape
```

### 4. Open UI

Go to: [http://localhost:3000](http://localhost:3000)

---

## Docker Setup

```bash
cp .env.example .env
docker-compose up --build
```

Then trigger the scrape in another terminal:
```bash
curl -X POST http://localhost:4000/scrape
```

UI will be available at http://localhost:3000

## API Endpoints

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/promotions`          | Paginated list (supports search, filters) |
| GET    | `/promotions/:id`      | Get single promotion                 |
| GET    | `/brands`              | List brands with promotion count     |
| POST   | `/scrape`              | Trigger full scrape                  |

**Query Parameters for `/promotions`**:
- `search` — Search in promo name or brand
- `brand` — Filter by brand name
- `page` / `pageSize` — Pagination

## Environment Variables

See [`.env.example`](.env.example)

| Variable            | Description                        | Default                     |
|---------------------|------------------------------------|-----------------------------|
| `PORT`              | API server port                    | 4000                        |
| `DATABASE_PATH`     | Path to SQLite database            | `./data/promos.db`          |
| `SCRAPE_DELAY_MS`   | Delay between requests (politeness)| 600                         |

## Project Structure

```
promo-aggregator/
├── packages/shared/     # Shared TypeScript types
├── apps/api/            # Express + Playwright + SQLite
├── apps/web/            # Next.js frontend
├── DESIGN.md
├── ASSUMPTIONS.md
└── docker-compose.yml
```

## Known Limitations

- Currently scrapes only the first page of `/sales`
- Scrape is synchronous (blocks request for 2–5 minutes)
- Selectors may need occasional updates if site structure changes

## Future Improvements

- Async scraping with job queue
- Multi-mall support
- Better date parsing
- Image caching / proxy
- Rate limiting & caching on API

---

**Made with ❤️ using TypeScript, Playwright, SQLite, Express, and Next.js**