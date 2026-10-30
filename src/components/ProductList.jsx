import { useEffect, useState } from "react";
import CurrencyVatModule from "../modules/currency-vat/index.js";
const currencyVatModule = new CurrencyVatModule();

function ProductList({ onSelectProduct }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState("SEK");
    const [prices, setPrices] = useState({});
    const [priceError, setPriceError] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products");

                if (!response.ok) {
                    throw new Error("Kunde inte hämta produkter.");
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    useEffect(() => {
        async function updatePrices() {
            try {
                const results = await Promise.all(
                    products.map(async (product) => {
                        const result = await currencyVatModule.run(
                            {
                                amount: product.price,
                                category: "standard",
                                currency: currency
                            },
                            { productId: product.id }
                        );

                        return [product.id, result.finalPrice];
                    })
                );

                setPrices(Object.fromEntries(results));
                setPriceError("");
            } catch (error) {
                setPriceError(error.message);
            }
        }

        if (products.length > 0) {
        updatePrices();
        }
    }, [products, currency]);

    if (loading) return <p>Laddar produkter...</p>;

    return (
        <section className="products-section">
            <h2>Våra produkter</h2>

            <label>
                Visa priser i:{" "}
                <select
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    >
                    <option value="SEK">SEK</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                </select>
            </label>

            {priceError && <p>{priceError}</p>}

            <div className="products">
                {products.map((product) => (
                <article className="product-card" key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    <strong>
                    {prices[product.id] || "Beräknar pris..."}
                    </strong>

                    <button onClick={() => onSelectProduct(product)}>
                    Visa produkt
                    </button>
                </article>
                ))}
            </div>
        </section>
    );
}

export default ProductList;