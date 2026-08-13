# Game Items Store — Hook Map

A small React/Vite project that reviews the requested hooks step by step.

## Hook map

1. **Item Data + Add to Cart — `useState`**
   - `App.jsx` stores the mock item list and search text with `useState`.
   - `ItemCard.jsx` adds items to the cart.

2. **Cart Count in Tab Title — `useEffect`**
   - `CartContext.jsx` updates `document.title` whenever the cart count changes and restores the title during cleanup.

3. **Search with Auto-focus — `useRef`**
   - `SearchBar.jsx` stores a DOM reference to the search input and focuses it after mount.

4. **Complex Cart State — `useReducer`**
   - `cartReducer.js` handles ADD, INCREMENT, DECREMENT, REMOVE and CLEAR actions without mutating state.

5. **Shared Cart Context — `useContext`**
   - `CartContext.jsx` exposes cart data/actions to `ItemCard`, `Cart`, `Checkout`, and `App` without prop drilling.

6. **Persistence + Checkout — custom hooks + cleanup**
   - `usePersistentCart.js` persists cart state to `localStorage`.
   - `useCheckout.js` simulates checkout with a timer and clears the timer on unmount.

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Notes

- No backend is required.
- Checkout logs one order object to the browser console.
- Cart contents survive page refreshes via `localStorage`.
