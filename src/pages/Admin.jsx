import { useEffect, useState } from "react";

function Admin() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

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
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    function updateStock(id, value) {
        setProducts((previousProducts) =>
        previousProducts.map((product) =>
            product.id === id
            ? { ...product, stock: value }
            : product
        )
        );
    }

    async function saveStock(product) {
        try {
            const response = await fetch(`/api/products/${product.id}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                stock: Number(product.stock),
                }),
            });

            if (!response.ok) {
                throw new Error("Kunde inte uppdatera lagersaldot.");
            }

            setMessage(`Lagersaldot för ${product.name} har uppdaterats.`);
            } catch (error) {
            setMessage(error.message);
        }
    }

    if (loading) return <p>Laddar produkter...</p>;

    return (
        <main className="admin">
            <h1>Administration</h1>
            <h2>Lagerhantering</h2>

            {products.map((product) => (
                <article className="product-card" key={product.id}>
                <h3>{product.name}</h3>

                <p>
                    Lagersaldo: {product.stock ?? 0} st
                </p>

                {(product.stock ?? 0) <= 5 && (
                    <p style={{ color: "red" }}>
                    Varning: Lågt lagersaldo!
                    </p>
                )}

                <label>
                    Nytt lagersaldo:{" "}
                    <input
                    type="number"
                    min="0"
                    value={product.stock ?? 0}
                    onChange={(event) =>
                        updateStock(product.id, event.target.value)
                    }
                    />
                </label>

                <button onClick={() => saveStock(product)}>
                    Spara lagersaldo
                </button>
                </article>
            ))}

            {message && <p>{message}</p>}
        </main>
    );
}

export default Admin;