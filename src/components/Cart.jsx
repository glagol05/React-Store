import { useEffect, useState } from "react";
import { getDiscount } from "../modules/campaigns";
import { calculateShipping } from "../modules/shipping";
import Checkout from "./Checkout";
import CurrencyVatModule from "../modules/currency-vat/index.js";

const currencyVatModule = new CurrencyVatModule();

function Cart({ cart, onIncrease, onDecrease, onRemove, onBack }) {
    const [campaignCode, setCampaignCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [currency, setCurrency] = useState("SEK");
    const [convertedPrices, setConvertedPrices] = useState({});
    const [priceError, setPriceError] = useState("");
    const [message, setMessage] = useState("");
    const [destination, setDestination] = useState("sverige");

    const groupedCart = cart.reduce((items, product) => {
        const existing = items.find((item) => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            items.push({ ...product, quantity: 1 });
        }

        return items;
    }, []);

    useEffect(() => {
        async function updatePrices() {
            try {
                const results = await Promise.all(
                    groupedCart.map(async (product) => {
                        const result = await currencyVatModule.run(
                            {
                                amount: product.price,
                                category: "standard",
                                currency: currency
                            },
                            { productId: product.id }
                        );

                        return [product.id, {
                            formatted: result.finalPrice,
                            amount: result.finalAmount
                        }];
                    })
                );

                setConvertedPrices(Object.fromEntries(results));
                setPriceError("");
            } catch (error) {
                setPriceError(error.message);
            }
        }

        if (groupedCart.length > 0) {
            updatePrices();
        } else {
            setConvertedPrices({});
        }
    }, [cart, currency]);

    const total = groupedCart.reduce(
        (sum, product) =>
            sum + (convertedPrices[product.id]?.amount || 0) * product.quantity,
        0
    );

    const discountedTotal = total * (1 - discount / 100);

    const [shipping, setShipping] = useState(0);

    useEffect(() => {
        async function updateShipping() {
            try {
                const shippingInSEK = calculateShipping(cart, destination);
                const convertedShipping = await currencyVatModule.convertAmount(
                    shippingInSEK,
                    currency
                );

                setShipping(convertedShipping);
            } catch (error) {
                setPriceError(error.message);
            }
        }

        updateShipping();
    }, [cart, destination, currency]);

    const finalTotal = discountedTotal + shipping;

    function applyCampaign() {
        const result = getDiscount(campaignCode);

        if (result > 0) {
            setDiscount(result);
            setMessage(`Du har fått ${result}% rabatt!`);
        } else {
            setDiscount(0);
            setMessage("Ogiltig kampanjkod.");
        }
    }

    return (
        <main className="cart">
            <button
                className="back-to-shop"
                onClick={onBack}
            >
                ← Tillbaka till butiken
            </button>

            <h1>Din kundvagn</h1>
            <p className="cart-subtitle">
                Granska dina produkter och slutför ditt köp.
            </p>

            <div className="cart-section">
                <label htmlFor="cart-currency">Visa priser i:</label>
                <select
                    id="cart-currency"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                >
                    <option value="SEK">SEK</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                </select>
            </div>

            {priceError && <p>{priceError}</p>}

            {groupedCart.length === 0 ? (
                <section className="empty-cart">
                <h2>Din kundvagn är tom</h2>
                <p>Du har inte lagt till några produkter ännu.</p>
                </section>
            ) : (
                <div className="cart-layout">
                <section className="cart-products">
                    <h2>Dina produkter ({cart.length})</h2>

                    {groupedCart.map((product) => (
                    <article className="cart-item" key={product.id}>
                        <div className="cart-product-info">
                            <h3>{product.name}</h3>
                            <p>{convertedPrices[product.id]?.formatted || "Laddar pris..."}</p>
                        </div>

                        <div className="cart-product-actions">
                            <div className="quantity-control">
                                <button onClick={() => onDecrease(product)}>
                                −
                                </button>
                                <strong>{product.quantity}</strong>
                                <button onClick={() => onIncrease(product)}>
                                +
                                </button>
                            </div>

                            <strong className="cart-subtotal">
                                {convertedPrices[product.id]
                                    ? new Intl.NumberFormat("sv-SE", {
                                        style: "currency",
                                        currency: currency
                                    }).format(
                                        convertedPrices[product.id].amount * product.quantity
                                    )
                                    : "Laddar..."}
                            </strong>

                            <button
                                className="remove-button"
                                onClick={() => onRemove(product)}
                            >
                                Ta bort
                            </button>
                        </div>
                    </article>
                    ))}
                </section>

                <aside className="cart-summary">
                    <h2>Ordersammanfattning</h2>

                    <div className="cart-section">
                        <label htmlFor="campaign">Kampanjkod</label>
                        <div className="campaign-input">
                            <input
                            id="campaign"
                            type="text"
                            placeholder="Ange kampanjkod"
                            value={campaignCode}
                            onChange={(event) =>
                                setCampaignCode(event.target.value)
                            }
                            />
                            <button onClick={applyCampaign}>Använd</button>
                        </div>
                        {message && <p className="campaign-message">{message}</p>}
                    </div>

                    <div className="cart-section">
                        <label htmlFor="destination">Leveransdestination</label>
                        <select
                            id="destination"
                            value={destination}
                            onChange={(event) => setDestination(event.target.value)}
                        >
                            <option value="sverige">Sverige</option>
                            <option value="norden">Norden</option>
                            <option value="europa">Övriga Europa</option>
                        </select>
                    </div>

                    <div className="summary-lines">
                        <p>
                            <span>Varor (inkl. moms)</span>
                            <span>
                                {new Intl.NumberFormat("sv-SE", {
                                    style: "currency",
                                    currency: currency
                                }).format(total)}
                            </span>
                        </p>
                        <p>
                            <span>Rabatt</span>
                            <span>{discount}%</span>
                        </p>
                        <p>
                            <span>Frakt</span>
                            <span>
                                {new Intl.NumberFormat("sv-SE", {
                                    style: "currency",
                                    currency: currency
                                }).format(shipping)}
                            </span>
                        </p>
                    </div>

                    <div className="final-total">
                        <span>Att betala</span>
                        <strong>
                            {new Intl.NumberFormat("sv-SE", {
                                style: "currency",
                                currency: currency
                            }).format(finalTotal)}
                        </strong>
                    </div>

                        <Checkout cart={cart} total={finalTotal} currency={currency} />
                    </aside>
                </div>
            )}
        </main>
    );
}

export default Cart;
