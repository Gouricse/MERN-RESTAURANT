import React, { useState } from "react";
import "./Menu.css"; // Ensure you have the CSS file for print styles.

const Menu = () => {
    const [cart, setCart] = useState([]);
    const [bill, setBill] = useState(null);

    // Menu data with images
    const menuData = [
        {
            category: "Starters",
            items: [
                { name: "Chicken Chilly", price: 150, image: "/images/chicken-chilly.jpeg" },
                { name: "Paneer Tikka", price: 180, image: "/images/paneer-tikka.jpeg" },
                { name: "French Fries", price: 120, image: "/images/french-fries.jpeg" },
            ],
        },
        {
            category: "Main Course",
            items: [
                { name: "Butter Chicken", price: 250, image: "/images/butter-chicken.jpeg" },
                { name: "Paneer Butter Masala", price: 220, image: "/images/paneer-butter-masala.jpeg" },
                { name: "Dal Tadka", price: 200, image: "/images/dal-tadka.jpeg" },
            ],
        },
        {
            category: "Breads",
            items: [
                { name: "Butter Naan", price: 40, image: "/images/butter-naan.jpeg" },
                { name: "Garlic Naan", price: 50, image: "/images/garlic-naan.jpeg" },
                { name: "Tandoori Roti", price: 30, image: "/images/tandoori-roti.jpeg" },
            ],
        },
        {
            category: "Desserts",
            items: [
                { name: "Gulab Jamun", price: 80, image: "/images/gulab-jamun.jpeg" },
                { name: "Rasgulla", price: 70, image: "/images/rasgulla.jpeg" },
                { name: "Ice Cream", price: 90, image: "/images/ice-cream.jpeg" },
            ],
        },
    ];

    // Add item to cart
    const addToCart = (item) => {
        const existingItem = cart.find((cartItem) => cartItem.name === item.name);
        if (existingItem) {
            setCart(
                cart.map((cartItem) =>
                    cartItem.name === item.name
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    // Calculate total price
    const getTotalPrice = () =>
        cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Generate the bill
    const generateBill = () => {
        const billContent = (
            <div className="bill">
                <h3 className="text-center mb-3">Bill Summary</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>₹{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.price * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-between fw-bold">
                    <span>Total Amount:</span>
                    <span>₹{getTotalPrice()}</span>
                </div>
                <div className="text-center mt-4">
                    <button
                        className="btn btn-primary print-only"
                        onClick={() => window.print()}
                    >
                        Print Bill
                    </button>
                </div>
            </div>
        );
        setBill(billContent);
    };

    return (
        <section className="menu py-5 bg-light">
            <div className="container">
                <h2 className="text-center mb-4">Our Menu</h2>
                <div className="row">
                    <div className="col-lg-8">
                        {menuData.map((category, index) => (
                            <div key={index} className="menu-category mb-5">
                                <h3 className="text-primary">{category.category}</h3>
                                <hr />
                                <div className="row">
                                    {category.items.map((item, idx) => (
                                        <div key={idx} className="col-md-6 mb-3">
                                            <div className="menu-item d-flex align-items-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="menu-item-image me-3"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "cover",
                                                        borderRadius: "5px",
                                                    }}
                                                />
                                                <div className="d-flex justify-content-between w-100 align-items-center">
                                                    <div>
                                                        <h5 className="mb-1">{item.name}</h5>
                                                    </div>
                                                    <div>
                                                        <span className="text-primary fw-bold me-3">
                                                            ₹{item.price}
                                                        </span>
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => addToCart(item)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-lg-4">
                        <div className="cart bg-white p-4 shadow">
                            <h4 className="text-center mb-3">Your Cart</h4>
                            {cart.length > 0 ? (
                                <div>
                                    <ul className="list-group mb-3">
                                        {cart.map((item, index) => (
                                            <li
                                                key={index}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    {item.name}
                                                    <span className="text-muted ms-2">
                                                        ₹{item.price} * {item.quantity}
                                                    </span>
                                                </div>
                                                <span>₹{item.price * item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="d-flex justify-content-between fw-bold mb-3">
                                        <span>Total:</span>
                                        <span>₹{getTotalPrice()}</span>
                                    </div>
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={generateBill}
                                    >
                                       Buy Items
                                    </button>
                                </div>
                            ) : (
                                <p className="text-center text-muted">Your cart is empty.</p>
                            )}
                        </div>
                    </div>
                </div>
                {bill && (
                    <div className="bill-section mt-5 bg-white p-4 shadow">
                        {bill}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Menu;
