import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';

export default function CartCheckout() {
  const [cart, setCart] = useState([
    { id: 1, name: "Premium Headphones", price: 129.99, qty: 1, img: "https://i.pinimg.com/736x/9b/a3/93/9ba39306d8f19498878c8547bf17a041.jpg" },
    { id: 2, name: "Wireless Mouse", price: 49.99, qty: 2, img: "https://i.pinimg.com/736x/b8/40/aa/b840aa9a99795fe2bee583caff2fba81.jpg" }
  ]);

  const updateQty = (id, delta) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
  const tax = (subtotal * 0.18).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl grid md:grid-cols-3 gap-6">

        {/* Cart Section */}
        <div className="md:col-span-2 bg-white shadow-xl rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-xl font-bold">Your Cart</h2>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b">
                <div className="flex items-center gap-4">
                  <img src={item.img} className="w-20 h-20 rounded-xl shadow" />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-500 text-sm">₹ {item.price}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 bg-gray-200 rounded-lg">-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 bg-blue-500 text-white rounded-lg">+</button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold mb-2">₹ {(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹ {subtotal}</span></div>
            <div className="flex justify-between"><span>GST (18%)</span><span>₹ {tax}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>₹ {total}</span></div>
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg">
            <CreditCard className="w-5 h-5" /> Proceed to Checkout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
