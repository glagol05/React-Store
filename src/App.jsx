import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./components/Cart";
import Admin from "./pages/Admin";

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  function addToCart(product) {
    const quantityInCart = cart.filter(
      (item) => item.id === product.id
    ).length;

    if (quantityInCart >= (product.stock ?? 0)) {
      alert("Det finns inte fler exemplar av produkten i lager.");
      return;
    }

    setCart((previousCart) => [...previousCart, product]);
    alert(`${product.name} har lagts i kundvagnen!`);
  }

  function increaseQuantity(product) {
    const quantityInCart = cart.filter(
      (item) => item.id === product.id
    ).length;

    if (quantityInCart >= (product.stock ?? 0)) {
      alert("Det finns inte fler exemplar av produkten i lager.");
      return;
    }

    setCart((previousCart) => [...previousCart, product]);
  }

  function decreaseQuantity(product) {
    setCart((previousCart) => {
      const index = previousCart.findIndex(
        (item) => item.id === product.id
      );

      if (index === -1) return previousCart;

      return previousCart.filter((_, i) => i !== index);
    });
  }

  function removeProduct(product) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== product.id)
    );
  }

  return (
    <>
      <Navbar
        onGoHome={() => {
          setShowCart(false);
          setShowAdmin(false);
          setSelectedProduct(null);
        }}
      />

      <div className="main-navigation">
        <button
          className={showCart ? "active" : ""}
          onClick={() => {
            setShowCart(!showCart);
            setShowAdmin(false);
            setSelectedProduct(null);
          }}
        >
          🛒 Kundvagn ({cart.length})
        </button>

        <button
          className={showAdmin ? "active" : ""}
          onClick={() => {
            setShowAdmin(!showAdmin);
            setShowCart(false);
            setSelectedProduct(null);
          }}
        >
          ⚙ Administration
        </button>
      </div>

      {showAdmin ? (
        <Admin />
      ) : showCart ? (
        <Cart
          cart={cart}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeProduct}
          onBack={() => setShowCart(false)}
        />
      ) : selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      ) : (
        <Home onSelectProduct={setSelectedProduct} />
      )}
    </>
  );
}

export default App;
