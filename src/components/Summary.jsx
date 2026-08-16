import { useEffect, useState } from 'react'

// DEMO SHIM — reads prices out of the DOM so the summary looks live during a
// CSS lecture. Not how you'd do this for real: on Wednesday the cart moves
// into a reducer and this file gets deleted.
export default function Summary() {
    const [prices, setPrices] = useState([])

    useEffect(() => {
        const read = () =>
            setPrices(
                [...document.querySelectorAll('.products .price')]
                    .map(el => parseFloat(el.textContent.replace(/[^0-9.]/g, '')))
                    .filter(Number.isFinite)
            )
        read()
        const obs = new MutationObserver(read)
        obs.observe(document.body, { childList: true, subtree: true, characterData: true })
        return () => obs.disconnect()
    }, [])

    const total = prices.reduce((a, b) => a + b, 0)
    const money = n => '$' + n.toFixed(2)

    return (
        <aside className="summary">
            <h2 className="summary__title">Order summary</h2>
            <div className="summary__row"><span>Items</span><span>{prices.length}</span></div>
            <div className="summary__row"><span>Subtotal</span><span>{money(total)}</span></div>
            <div className="summary__rule" />
            <div className="summary__row summary__row--total"><span>Total</span><span>{money(total)}</span></div>
            <button className="summary__button">Checkout</button>
        </aside>
    )
}