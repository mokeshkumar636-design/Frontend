import "./App.css";
import { useState } from "react";

function App() {

  const products = [
    {
      id: 1,
      name: "Laptop",
      price: 65000,
      image: "https://picsum.photos/250?1",
    },
    {
      id: 2,
      name: "Smart Phone",
      price: 25000,
      image: "https://picsum.photos/250?2",
    },
    {
      id: 3,
      name: "Headphone",
      price: 2500,
      image: "https://picsum.photos/250?3",
    },
    {
      id: 4,
      name: "Smart Watch",
      price: 4500,
      image: "https://picsum.photos/250?4",
    },
    {
      id: 5,
      name: "Camera",
      price: 55000,
      image: "https://picsum.photos/250?5",
    },
    {
      id: 6,
      name: "Keyboard",
      price: 1500,
      image: "https://picsum.photos/250?6",
    },
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(product.name + " Added to Cart");
  };

  return (
    <div>

      <header>
        <h1>🛍 ShopKart</h1>
        <h3>Cart : {cart.length}</h3>
      </header>

      <div className="products">

        {products.map((item) => (

          <div className="card" key={item.id}>

            <img src={item.image} alt={item.name} />

            <h2>{item.name}</h2>

            <h3>₹ {item.price}</h3>

            <button onClick={() => addToCart(item)}>
              Add to Cart
            </button>

          </div>

        ))}

      </div>

      <h2 className="cartTitle">Shopping Cart</h2>

      <div className="cart">

        {cart.length === 0 ? (
          <h3>No Products Added</h3>
        ) : (
          cart.map((item, index) => (
            <div className="cartItem" key={index}>
              {item.name} - ₹{item.price}
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default App;