# Commerce Search Lab

[![CI](https://github.com/fzemmel/commerce-search-lab/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fzemmel/commerce-search-lab/actions/workflows/ci.yml?query=branch%3Amain)

Commerce Search Lab is a Next.js product discovery app. Use React and Next.js App Router in a commerce context: product listing, faceted search, URL-driven state, server-rendered routes, external product data, and reusable UI components.

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
- Storybook
- DummyJSON product API with local fallback data
- `src/` directory and `@/*` import alias

## Features

- Landing page at `/`
- Product listing at `/products`
- Product detail pages at `/products/[slug]`
- External product catalog from DummyJSON with local mock products as a fallback
- Real product imagery rendered with `next/image`
- Product cards with brand, category, price, sale price, rating, and badges
- Search across product name, brand, and description
- Dynamic category filter based on the loaded catalog
- Sorting by name, price ascending, price descending, and rating descending
- URL-synchronized query state such as `/products?q=mascara&category=beauty&sort=price-asc`
- Empty state for searches without matches
- Loading, error, and not-found route structure
- Isolated component stories for UI primitives and product components
- Responsive Tailwind layout

## Architecture Decisions

- Product data is loaded from DummyJSON in `src/lib/products-api.ts` with ISR caching and a local fallback catalog in `src/data/products.ts`.
- Product domain types live in `src/types/product.ts`.
- Filtering, sorting, query parsing, dynamic category labels, and product lookup live in `src/lib/product-query.ts`.
- Reusable product UI is grouped under `src/components/product`.
- Interactive listing controls are grouped under `src/components/filters`.
- Generic primitives such as `Button`, `Badge`, `Input`, and `Select` are grouped under `src/components/ui`.
- Storybook is used for local component review and static build validation, but is not deployed separately.
- Global state libraries are intentionally avoided. The URL is the source of truth for listing state.

## Server Components vs. Client Components

Pages are Server Components by default. The product listing reads `searchParams`, loads the product catalog on the server, parses the query, filters the catalog, and renders the product grid on the server.

The external catalog is fetched with ISR so product data is cached and revalidated periodically instead of being requested on every page view:

```ts
fetch("https://dummyjson.com/products?limit=200", {
  next: { revalidate: 3600 },
});
```

Client Components are only used where browser interaction is required. `ProductFilters` uses Next navigation 
hooks to update the URL when the user searches, changes category, changes sorting, or resets filters. 
Once the URL changes, the server page receives new `searchParams` and renders the updated listing.

This keeps the data-reading path simple and server-first while still providing an interactive search and filter experience.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Run linting:

```bash
pnpm lint
```

Run unit tests:

```bash
pnpm test
```

Start Storybook locally:

```bash
pnpm storybook
```

Build Storybook statically:

```bash
pnpm build-storybook
```

Build the production app:

```bash
pnpm build
```

Start the production server after a build:

```bash
pnpm start
```

The app runs at `http://localhost:3000` by default.

If pnpm is not installed locally, install it first with your preferred Node package manager.

## Production Deployment

The app is deployed as a Dockerized Next.js standalone server. `next.config.ts` enables `output: "standalone"`, 
and the production image runs the generated `server.js` on port `3000`.

The deployment target is a Hetzner server with Docker, Docker Compose, and Caddy already configured. 
Caddy runs in Docker, terminates HTTPS, applies Basic Auth, and reverse proxies traffic to the app container 
through the shared Docker network `portfolio-lab_default`.

Expected Caddy upstream:

```caddyfile
lab.zemmel.es {
    basic_auth {
        felix <hashed-password>
    }

    reverse_proxy commerce-search-lab:3000
}
```

The production Compose file is `docker-compose.prod.yml`. It starts the `commerce-search-lab` service 
from the GitHub Container Registry image:

```txt
ghcr.io/fzemmel/commerce-search-lab:latest
```

No host port is exposed by the app container. Caddy reaches it by service name on the external Docker network.

## Deployment Pipeline

GitHub Actions runs quality checks for pushes and pull requests targeting `main`:

```bash
pnpm lint
pnpm test
pnpm build
pnpm build-storybook
pnpm lhci
```

On pushes to `main`, the deployment job then:

- Builds the Docker image.
- Pushes `latest` and commit-SHA tags to GHCR.
- Copies `docker-compose.prod.yml` to the Hetzner server.
- Logs in to GHCR on the server with a read-only package token.
- Pulls the latest image and restarts the Compose service.

Required GitHub repository secrets:

- `SSH_HOST`: Hetzner server hostname or IP.
- `SSH_USER`: SSH user used for deployment.
- `SSH_PRIVATE_KEY`: Private SSH key for the deployment user.
- `DEPLOY_PATH`: Server path for the app Compose file, for example `/opt/portfolio-lab/apps/commerce-search-lab`.
- `GHCR_READ_TOKEN`: GitHub token with `read:packages` permission for pulling the private GHCR image.

## Dependency Updates

Dependabot is configured in `.github/dependabot.yml` to open weekly pull requests for:

- pnpm dependencies from `package.json` and `pnpm-lock.yaml`.
- GitHub Actions used by the CI and deployment workflow.
- Docker base image updates for the production image.

Dependency updates are grouped for Next.js, React, Storybook, and tooling packages to keep pull requests reviewable. Dependabot pull requests run the normal quality pipeline and are merged manually.

## Useful Routes

- `/`
- `/products`
- `/products?q=mascara&category=beauty&sort=price-asc`
- `/products/essence-mascara-lash-princess-1`

## Possible Version 2 Improvements

- Add pagination or infinite loading
- Add multi-select facets such as brand, color, material, and sale status
- Add Playwright smoke tests for listing and detail routes
- Add component tests for product cards and filter controls
- Add route-level metadata and structured data for product details
- Move from the demo product API to a dedicated headless commerce adapter
- Add compare, wishlist, or recently viewed interactions
