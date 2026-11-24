# Game Items Store: Checkout Frontend

React + Vite storefront for the Xsolla School checkout project. Users browse game items and merch, keep a cart as a guest or logged in, sign up and log in, place an order and pay through Xsolla Pay Station, then see their orders and inventory. All data comes from the checkout backend over a REST API.

## Tech stack

- **React** with **Vite**
- **React Router** for pages
- **axios** for API calls
- **Datadog Browser RUM** for frontend monitoring
- **Playwright** for visual regression tests
- **ESLint** for linting
- **nginx** (in Docker) to serve the production build
- **GitLab CI** to lint, build and publish the Docker image

## Getting started

Requirements: Node.js 20+ and the backend running on `http://localhost:8080`.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173. In dev mode Vite forwards every `/api/*` request to `http://localhost:8080` and removes the `/api` prefix, so `/api/items` reaches the backend as `/items`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Store | Item catalogue, 9 items per page with pagination |
| `/login` | Login | Moves the guest cart into the account after login |
| `/signup` | Sign up | Goes to `/login` on success |
| `/checkout` | Checkout | Cart review and order placement; guests are sent to `/login` |
| `/orders` | Orders | Order history, 5 at a time with "Load more" |
| `/inventory` | Inventory | Items the user owns |
| `/payment/success` | Payment success | Links back to orders and the store |

## Project structure

```text
src/
├── main.jsx                 # Entry point: Router → AuthProvider → CartProvider → App; starts Datadog RUM
├── App.jsx                  # Routes, footer, light/dark theme
├── api/
│   └── client.js            # axios instance (baseURL "/api", sends cookies)
├── context/
│   ├── AuthContext.jsx      # Access token, current user, login/logout, token refresh on 401
│   └── CartContext.jsx      # Guest cart (localStorage) and server cart for logged-in users
├── reducers/
│   ├── cartReducer.js       # Pure cart state transitions
│   └── requestReducer.js    # Loading / success / error state for data fetching
├── hooks/
│   ├── useLocalStorage.js   # State that is saved to localStorage
│   └── useCheckout.js       # Order creation, idempotency key, payment redirect, error messages
├── pages/
│   ├── StorePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── CheckoutPage.jsx
│   ├── OrdersPage.jsx
│   ├── InventoryPage.jsx
│   └── PaymentSuccessPage.jsx
├── components/
│   ├── layout/              # Navbar, Footer (theme toggle), Pagination
│   ├── catalog/             # ItemGrid, ItemCard, skeleton loaders, SearchBar
│   ├── cart/                # Cart, CartItem, CartPopover
│   └── checkout/            # OrderSummary, OrderCard
├── telemetry/
│   └── rum.js               # Datadog RUM setup
├── utils/
│   └── itemImages.js        # Maps item IDs to images in public/images
└── styles/
    ├── tokens.css           # Design tokens for the light and dark themes
    └── globals.css
```

Most pages and components have their own CSS file next to them.

## How it works

### Authentication

1. `POST /login` returns a JWT. It is saved in localStorage (`accessToken`) and sent with every request as `Authorization: Bearer <token>`.
2. On page load the token is read back from localStorage and the user is loaded with `GET /user/me`.
3. If a request gets `401`, an axios interceptor calls `POST /token` once for a new access token and retries the request. If that fails, the user is logged out.
4. Logout calls `POST /logout` and clears the token.

The API client sends cookies with every request (`withCredentials: true`).

### Cart

- **Guests:** the cart is React state (`cartReducer`) saved to localStorage under `game-items-store-cart`.
- **Logged-in users:** the backend cart is the source of truth. Every add, quantity change and removal is sent to the backend first.
- **After login:** each guest cart item is sent to the backend, the server cart is reloaded and the localStorage cart is cleared.
- Merch items with no stock are marked sold out. Game items are never marked sold out.

### Checkout and payment

`useCheckout` places the order with `POST /orders`:

- Each checkout attempt sends a new `Idempotency-Key` header (UUID v4). `crypto.randomUUID()` only works on HTTPS or localhost, so on plain HTTP (for example `http://checkout.local`) the key is built with `crypto.getRandomValues()` instead.
- If the response has a `payment_url`, the browser goes to Xsolla Pay Station.
- If the user comes back from Pay Station with the browser's Back button, the page reloads so the button and cart aren't stuck in their old state.
- Errors are turned into messages: no response from the server, `401` (session expired), `402` (payment declined), `EMPTY_CART` and `INSUFFICIENT_STOCK`.

### API endpoints used

All paths below are relative to `/api`.

| Method | Path | Used for |
|---|---|---|
| `POST` | `/signup` | Create an account |
| `POST` | `/login` | Log in, returns `jwt` |
| `POST` | `/token` | Get a new access token |
| `POST` | `/logout` | Log out |
| `GET` | `/user/me` | Current user |
| `GET` | `/items` | Catalogue (`limit`, `offset`) |
| `GET` | `/user/cart` | Logged-in user's cart |
| `PATCH` | `/user/cart/items/:id` | Set an item's quantity (`{ quantity }`) |
| `DELETE` | `/user/cart/items/:id` | Remove an item from the cart |
| `POST` | `/orders` | Place an order (`Idempotency-Key` header) |
| `GET` | `/user/orders/cursor` | Order history (`limit`, `cursor`; response has `next_cursor`) |
| `GET` | `/user/inventory` | Items the user owns |

### Theme

The footer has a light/dark toggle. It sets `data-theme` on `<html>`, and the colours come from `styles/tokens.css`. The choice isn't saved, so a reload goes back to light mode.

### Monitoring

`src/telemetry/rum.js` starts Datadog RUM when the app loads (`service: checkout-frontend`, `env: dev`). It records every session, plus page resources, user interactions and long tasks. Session replay is off and on-screen text is masked. The Datadog settings are written directly in that file.

## Docker

The `Dockerfile` has two stages: it builds the app with `node:22-alpine`, then serves `dist/` with `nginx:alpine` on port 80.

`nginx.conf`:

- serves the single-page app (unknown paths fall back to `index.html`)
- forwards `/api/*` to `http://backend:8080/` with the `/api` prefix removed
- forwards `/webhook` to `http://backend:8080/webhook`, so Xsolla webhooks reach the backend on the same path locally and in minikube

The container needs a host named `backend` on port 8080. `compose.yaml` builds only the frontend and maps it to http://localhost:5173, so run it on a Docker network where the backend is reachable as `backend`.

The Helm chart for Kubernetes is in the separate `checkout-helm` repository.

## Visual tests (Playwright)

`tests/visual.spec.js` compares screenshots of:

- the store page in light mode
- the store page in dark mode
- the item grid at 800px wide (it should keep 3 columns)

The tests use a mock backend (`tests/mock-api/server.js`): a small Node server on port 8080 that answers `GET /items` with fixed data. `docker-compose.e2e.yml` starts it together with the frontend on http://localhost:3000.

```bash
docker compose -f docker-compose.e2e.yml up -d --build
npx playwright install chromium
npx playwright test
docker compose -f docker-compose.e2e.yml down
```

- Set `BASE_URL` to test another address (default `http://localhost:3000`).
- Update the reference screenshots with `npx playwright test --update-snapshots`. Linux and Windows have separate snapshots.
- The HTML report is written to `playwright-report/`.

## CI/CD (GitLab)

`.gitlab-ci.yml` has three stages:

| Stage | Job | What it does |
|---|---|---|
| lint | `lint` | `npm ci`, then `npm run lint` |
| build | `build` | `npm ci`, then `npm run build`; keeps `dist/` as an artifact for 1 week |
| docker | `docker` | Builds the image and pushes `$CI_REGISTRY_IMAGE:<commit SHA>` and `:latest` to the GitLab registry |

The Playwright `visual_tests` job is in the file but commented out.

## Known gaps

- `.env` has `VITE_API_URL`, but the code doesn't read it. The API base is always `/api`.
- The theme choice isn't saved between visits.
- `SearchBar` and `CartPopover` exist but aren't used on any page yet.
