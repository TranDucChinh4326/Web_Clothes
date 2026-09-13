# Web Clothes Project Rules

## Scope
- Build an online clothing store with a customer storefront and an admin area.
- Keep frontend and backend separated in `frontend/` and `backend/`.
- Use Vietnamese UI text with correct accents.
- Preserve existing behavior when extending features later.

## Frontend Rules
- Use semantic HTML, shared CSS, and page-specific JavaScript only when needed.
- Keep layouts responsive for mobile, tablet, and desktop.
- Reuse shared components where practical: header, footer, product cards, form styles, buttons, and tables.
- Do not hard-code duplicated product data across many pages if it can be loaded from one JavaScript module or from the API.
- Customer pages must include: home, product listing, product detail, cart, checkout, login, register, and profile.
- Admin pages must include: dashboard, product management, and order management.

## Backend Rules
- Use Express routes grouped by feature.
- Validate required request fields before creating or updating data.
- Return JSON responses with consistent shape:
  - success response: `{ "success": true, "data": ... }`
  - error response: `{ "success": false, "message": "..." }`
- Keep database access inside model files.
- Use environment variables for database credentials and secrets.
- Never commit real passwords, tokens, or private keys.

## Database Rules
- Use MySQL.
- Core tables: users, categories, products, orders, order_items.
- Product stock is managed at product variant level when size/color support is added.
- Orders must keep historical price and product name in `order_items`.

## Code Style
- File and folder names use lowercase kebab-case or lowercase words.
- JavaScript uses `const` and `let`; avoid `var`.
- Keep functions small and named by purpose.
- Add comments only for non-obvious logic.

## Testing And Validation
- Run backend syntax checks after editing JavaScript files.
- Test user flows manually after UI changes: browsing, cart, checkout, login, and admin actions.
- Do not mark a feature complete until the related page/API has been checked.
