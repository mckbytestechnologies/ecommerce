import React, { useEffect, useState } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../utils/cart";
import "./CartPage.css"; // your CSS

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Load cart on mount
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal - discount;

  // Apply Coupon (simple example)
  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      const d = subtotal * 0.1;
      setDiscount(d);
      setAppliedCoupon("SAVE10");
    } else {
      alert("Invalid Coupon");
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCoupon("");
  };

  // Update quantity
  const changeQty = (id, qty) => {
    if (qty < 1) return;
    const updated = updateQuantity(id, qty);
    setCartItems(updated);
  };

  // Remove item
  const removeItem = (id) => {
    const updated = removeFromCart(id);
    setCartItems(updated);
  };

  return (
    <div className="cart-page">

      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <div className="cart-layout">

          {/* CART LEFT SECTION */}
          <div className="cart-display">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>₹{item.price}</p>
                  </div>

                  <div className="item-quantity">
                    <button onClick={() => changeQty(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQty(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="summary-row coupon-info">
                  <span>Discount ({appliedCoupon}):</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                  <button className="remove-coupon" onClick={removeCoupon}>
                    Remove
                  </button>
                </div>
              )}

              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="cart-actions">
            <h2>Cart Actions</h2>

            <input
              type="text"
              placeholder="Enter coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <button onClick={applyCoupon}>Apply Coupon</button>

            <h3>Options</h3>
            <button onClick={() => clearCart() && setCartItems([])}>
              Clear Cart
            </button>

            <button
              disabled={cartItems.length === 0}
              style={{ background: "#000" }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* DEBUG INFO */}
      <div className="cart-info">
        <h3>Cart Debug Info</h3>
        <pre>{JSON.stringify(cartItems, null, 2)}</pre>
      </div>
    </div>
  );
};

export default CartPage;
