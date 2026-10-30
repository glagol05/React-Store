
import { useState } from "react";

function Checkout({ cart, total, currency }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function placeOrder(event) {
        event.preventDefault();

        if (cart.length === 0) {
            setMessage("Kundvagnen är tom.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const groupedCart = cart.reduce((items, product) => {
                const existing = items.find((item) => item.id === product.id);

                if (existing) {
                existing.quantity += 1;
                } else {
                items.push({ ...product, quantity: 1 });
                }

                return items;
            }, []);

            const productsResponse = await fetch("/api/products");

            if (!productsResponse.ok) {
                throw new Error("Kunde inte kontrollera lagersaldot.");
            }

            const products = await productsResponse.json();

            for (const item of groupedCart) {
                const databaseProduct = products.find(
                    (product) => product.id === item.id
                );

                if (!databaseProduct) {
                    throw new Error(`${item.name} finns inte längre.`);
                }

                if ((databaseProduct.stock ?? 0) < item.quantity) {
                    throw new Error(`Inte tillräckligt många ${item.name} i lager.`);
                }
            }

            const order = {
                email,
                products: groupedCart,
                total,
                currency,
                date: new Date().toISOString(),
                status: "Mottagen",
            };

            const orderResponse = await fetch("/api/orders", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
            });

            if (!orderResponse.ok) {
                throw new Error("Beställningen kunde inte sparas.");
            }

            for (const item of groupedCart) {
                const databaseProduct = products.find(
                (product) => product.id === item.id
                );

                const stockResponse = await fetch(
                    `/api/products/${item.id}`,
                    {
                        method: "PATCH",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                        stock: databaseProduct.stock - item.quantity,
                        }),
                    }
                );

                if (!stockResponse.ok) {
                    throw new Error("Beställningen sparades, men lagret kunde inte uppdateras.");
                }
            }

            setMessage("Tack! Din beställning har sparats.");
            setEmail("");
            } catch (error) {
            setMessage(error.message);
            } finally {
            setLoading(false);
        }
    }

    return (
        <section className="checkout">
        <h2>Kassa</h2>

        <form onSubmit={placeOrder}>
            <label htmlFor="email">E-postadress</label>

            <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="namn@exempel.se"
            required
            />

            <button type="submit" disabled={loading || cart.length === 0}>
            {loading ? "Skickar..." : "Slutför köp"}
            </button>
        </form>

        {message && <p>{message}</p>}
        </section>
    );
}

export default Checkout;
