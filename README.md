# Commerce Search Lab

Commerce Search Lab is a Next.js product discovery app. Use React and Next.js App Router in a commerce context: product listing, faceted search, URL-driven state, server-rendered routes, typed mock data, and reusable UI components.

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
- Local mock product data
- `src/` directory and `@/*` import alias

## Features

- Landing page at `/`
- Product listing at `/products`
- Product detail pages at `/products/[slug]`
- 16 typed mock products across apparel, footwear, accessories, and equipment
- Product cards with brand, category, price, sale price, rating, and badges
- Search across product name, brand, and description
- Category filter
- Sorting by name, price ascending, price descending, and rating descending
- URL-synchronized query state such as `/products?q=shirt&category=apparel&sort=price-asc`
- Empty state for searches without matches
- Loading, error, and not-found route structure
- Responsive Tailwind layout

## Architecture Decisions

- Product data lives in `src/data/products.ts` for version 1. There is no backend or database yet.
- Product domain types live in `src/types/product.ts`.
- Filtering, sorting, query parsing, category labels, and product lookup live in `src/lib/product-query.ts`.
- Reusable product UI is grouped under `src/components/product`.
- Interactive listing controls are grouped under `src/components/filters`.
- Generic primitives such as `Button`, `Badge`, `Input`, and `Select` are grouped under `src/components/ui`.
- Global state libraries are intentionally avoided. The URL is the source of truth for listing state.

## Server Components vs. Client Components

Pages are Server Components by default. The product listing reads `searchParams`, parses the query, filters the local catalog, and renders the product grid on the server.

Client Components are only used where browser interaction is required. `ProductFilters` uses Next navigation hooks to update the URL when the user searches, changes category, changes sorting, or resets filters. Once the URL changes, the server page receives new `searchParams` and renders the updated listing.

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

The app runs at `http://localhost:3000` by default.

If pnpm is not installed locally, install it first with your preferred Node package manager.

## Useful Routes

- `/`
- `/products`
- `/products?q=shirt&category=apparel&sort=price-asc`
- `/products/atlas-organic-cotton-tee`

## Possible Version 2 Improvements

- Add pagination or infinite loading
- Add multi-select facets such as brand, color, material, and sale status
- Add product image assets or a small image pipeline
- Add Playwright smoke tests for listing and detail routes
- Add unit tests for `product-query.ts`
- Add route-level metadata and structured data for product details
- Move mock data behind a small API layer or headless commerce adapter
- Add compare, wishlist, or recently viewed interactions
