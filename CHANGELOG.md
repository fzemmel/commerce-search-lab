# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

## 0.3.0 - 2026-06-26

### Added

- Docker-based Hetzner deployment setup with a Next.js standalone production image.
- Production Compose configuration for the existing Docker Caddy network.
- GitHub Actions deployment job that builds and pushes GHCR images, then deploys to Hetzner over SSH.
- Deployment documentation for required GitHub Secrets, Caddy upstream, and server setup.

## 0.2.0 - 2026-06-26

### Added

- Lighthouse CI checks for key routes in the GitHub Actions pipeline, including report artifact upload.
- Vitest unit tests for product query parsing, filtering, sorting, price formatting, and class name utilities.

## 0.1.0 - 2026-06-20

### Added

- Initial Next.js App Router application setup with React, TypeScript, Tailwind CSS, ESLint, `src/`, and `@/*` imports.
- Commerce product discovery routes for `/`, `/products`, and `/products/[slug]`.
- Typed local mock catalog with 16 products across apparel, footwear, accessories, and equipment.
- URL-synchronized product search, category filtering, and sorting.
- Reusable product components for cards, grids, prices, badges, and detail views.
- Focused filter components for search, category selection, sort selection, and reset behavior.
- Loading, error, empty, and not-found route states.
- Accessibility improvements for labels, form control names, semantic product lists, prices, ratings, loading states, and error messaging.
- pnpm-based project setup with a committed `pnpm-lock.yaml`.
