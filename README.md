# Web Clothes

Frontend-first clothing shop project for Git and Cloudflare Pages deployment.

## Project Structure

```text
frontend/   Static customer and admin pages
backend/    Express API scaffold for later backend work
RULES.md    Project rules that future changes must follow
```

## Run Frontend Locally

From the project root:

```bash
npx serve frontend
```

Or open `frontend/index.html` directly in a browser.

## Cloudflare Pages Settings

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `frontend`
- Root directory: project root

## Current Frontend Features

- Home page with featured products
- Product listing with category filter
- Product detail page
- Local cart using `localStorage`
- Checkout form with local order confirmation
- Login, register, profile, and admin placeholder pages
