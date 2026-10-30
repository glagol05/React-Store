import { useEffect, useState } from "react";
import CurrencyVatModule from "../modules/currency-vat/index.js";
const currencyVatModule = new CurrencyVatModule();

function ProductDetails({ product, onBack, onAddToCart }) {
    const [currency, setCurrency] = useState("SEK");
    const [displayPrice, setDisplayPrice] = useState("");
    const [priceError, setPriceError] = useState("");

    useEffect(() => {
        async function updatePrice() {
            try {
                const result = await currencyVatModule.run(
                    {
                        amount: product.price,
                        category: "standard",
                        currency: currency
                    },
                    { productId: product.id }
                );
                setDisplayPrice(result.finalPrice);
                setPriceError("");
            } catch (error) {
                setPriceError(error.message);
                setDisplayPrice("");
            }
        }

        if (product) {
                updatePrice();
            }
    }, [product, currency]);

    if (!product) return <p>Produkten kunde inte hittas.</p>;

    return (
        <main className="product-details">
            <button onClick={onBack}>← Tillbaka till produkter</button>

            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <label>
                Visa pris i:{" "}
                <select
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    >
                    <option value="SEK">SEK</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                </select>
            </label>

            {priceError ? (
                <p>{priceError}</p>
            ) : (
                <h2>{displayPrice || "Beräknar pris..."}</h2>
            )}

            <p>Priset visas inklusive moms.</p>

            <button onClick={() => onAddToCart(product)}>
                Lägg i kundvagn
            </button>
        </main>
    );
}

export default ProductDetails;