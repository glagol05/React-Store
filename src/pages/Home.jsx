import ProductList from "../components/ProductList";

function Home({ onSelectProduct }) {
    return (
        <main className="home">
            <h1>Välkommen till Nordic Shop</h1>
            <p>Upptäck vårt sortiment av produkter.</p>

            <ProductList onSelectProduct={onSelectProduct} />
        </main>
    );
}

export default Home;