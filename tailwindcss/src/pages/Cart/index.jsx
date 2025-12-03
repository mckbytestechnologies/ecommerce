import React from "react";
import { MdDelete } from "react-icons/md";

const sampleCart = [
  {
    id: 1,
    title: "Samsung Galaxy S23 Ultra",
    price: 899,
    qty: 1,
    image:
      "https://cdn.pixabay.com/photo/2015/01/20/21/14/smartphone-605422_960_720.jpg",
  },
  {
    id: 2,
    title: "Canon EOS 80D DSLR Camera",
    price: 699,
    qty: 1,
    image:
      "https://cdn.pixabay.com/photo/2016/11/23/00/39/camera-1854109_960_720.jpg",
  },
];

const Cart = () => {
  return (
    <div className="px-6 py-10 container mx-auto">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart 🛒</h2>

      <div className="bg-white shadow-xl rounded-2xl p-6">
        {sampleCart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center justify-between border-b py-5"
          >
            {/* Image */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img
                src={item.image}
                className="w-24 h-24 object-contain rounded-lg border"
                alt={item.title}
              />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-blue-600 font-bold text-lg">${item.price}</p>
              </div>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className="font-semibold">Qty:</span>
              <input
                type="number"
                defaultValue={item.qty}
                className="w-16 px-2 py-1 border rounded-lg"
              />
            </div>

            {/* Delete */}
            <button className="text-red-600 hover:text-red-800 mt-4 md:mt-0">
              <MdDelete size={26} />
            </button>
          </div>
        ))}

        <div className="flex justify-end mt-6">
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
