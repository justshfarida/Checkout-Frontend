# Game Items Store

React homework project demonstrating core hooks, custom hooks, Context, reducer-based state, and localStorage persistence.

## Architecture

```text
src/
├── App.jsx                    # App-level theme persistence
├── main.jsx                   # React entry point + providers
├── pages/
│   └── StorePage.jsx          # Store page composition + page UI state
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── catalog/
│   │   ├── SearchBar.jsx
│   │   ├── ItemGrid.jsx
│   │   └── ItemCard.jsx
│   ├── cart/
│   │   └── Cart.jsx
│   └── checkout/
│       └── Checkout.jsx
├── context/
│   └── CartContext.jsx        # Shared cart state and cart actions
├── reducers/
│   └── cartReducer.js         # Pure cart state transitions
├── hooks/
│   ├── useLocalStorage.js     # Persistence for cart + theme
│   └── useCheckout.js         # Checkout behavior
├── data/
│   └── items.js               # Static product data
└── styles.css
```

## Hook responsibilities

- `useState`: search text, cart popover visibility, checkout form state.
- `useEffect`: cart persistence, document title, input focus, timer cleanup.
- `useReducer`: cart add/remove/increment/decrement/clear state transitions.
- `useContext`: makes cart state/actions available throughout the app.
- `useLocalStorage`: reusable persistence hook used for **both cart and theme**.
- `useCheckout`: custom hook for simulated checkout status.

## Cart persistence flow

`CartContext` reads the initial saved cart with `useLocalStorage`, initializes `useReducer` with it, and syncs reducer changes back to localStorage with `useEffect`.

## Run

```bash
npm install
npm run dev
```
