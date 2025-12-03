import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  FileText,
  ShoppingBag,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

export default function MyOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");

  const orders = [
    {
      id: "ORD-58291",
      date: "28 Nov 2025",
      status: "Delivered",
      amount: 149.99,
      items: [
        { name: "Nike Air Max 270", qty: 1, price: 129.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
        { name: "Sport Socks Pack", qty: 2, price: 10.00, image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w-400&h=400&fit=crop" }
      ],
      shipping: {
        address: "123 Main St, Bangalore, KA 560001",
        carrier: "BlueDart Express",
        tracking: "BDX5829174832"
      },
      payment: "Credit Card (•••• 4532)"
    },
    {
      id: "ORD-58142",
      date: "22 Nov 2025",
      status: "Shipped",
      amount: 89.50,
      items: [
        { name: "Wireless Earbuds", qty: 1, price: 89.50, image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=400&fit=crop" }
      ],
      shipping: {
        address: "456 Park Ave, Mumbai, MH 400001",
        carrier: "Delhivery",
        tracking: "DLV5814298765"
      },
      payment: "UPI"
    },
    {
      id: "ORD-58010",
      date: "18 Nov 2025",
      status: "Processing",
      amount: 39.99,
      items: [
        { name: "Leather Wallet", qty: 1, price: 39.99, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop" }
      ],
      shipping: {
        address: "789 MG Road, Delhi, DL 110001",
        carrier: "ShipRocket",
        tracking: "SRT5801054321"
      },
      payment: "Credit Card (•••• 7890)"
    },
    {
      id: "ORD-57985",
      date: "15 Nov 2025",
      status: "Delivered",
      amount: 245.75,
      items: [
        { name: "Casual Backpack", qty: 1, price: 89.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
        { name: "Water Bottle", qty: 1, price: 25.99, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop" },
        { name: "Notebook Set", qty: 3, price: 43.25, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop" }
      ],
      shipping: {
        address: "101 Tech Park, Hyderabad, TS 500081",
        carrier: "FedEx",
        tracking: "FDX5798567890"
      },
      payment: "Net Banking"
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      Delivered: {
        icon: <CheckCircle className="text-white" size={18} />,
        bg: "bg-gradient-to-r from-green-500 to-emerald-600",
        text: "text-green-700",
        label: "Delivered",
        progress: 100
      },
      Shipped: {
        icon: <Truck className="text-white" size={18} />,
        bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
        text: "text-blue-700",
        label: "Shipped",
        progress: 75
      },
      Processing: {
        icon: <Clock className="text-white" size={18} />,
        bg: "bg-gradient-to-r from-amber-500 to-orange-600",
        text: "text-amber-700",
        label: "Processing",
        progress: 40
      }
    };
    return configs[status] || configs.Processing;
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = orders.length;

  const OrderDetails = ({ order, onClose }) => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{order.id}</h2>
              <p className="text-gray-500">Ordered on {order.date}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${getStatusConfig(order.status).bg} text-white font-medium`}>
            {order.status}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag size={20} />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                  </div>
                  <div className="font-semibold">₹{item.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Shipping Info
              </h3>
              <p className="text-gray-700 mb-2">{order.shipping.address}</p>
              <div className="text-sm text-gray-500">
                <p>Carrier: {order.shipping.carrier}</p>
                <p>Tracking: {order.shipping.tracking}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Info
              </h3>
              <p className="text-gray-700">{order.payment}</p>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{order.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition">
              Track Order
            </button>
            <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:border-gray-400 transition">
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">
                {totalOrders} orders • ₹{totalSpent.toFixed(2)} total spent
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
              <div className="text-gray-500 text-sm">Total Orders</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'Delivered').length}
              </div>
              <div className="text-gray-500 text-sm">Delivered</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'Shipped').length}
              </div>
              <div className="text-gray-500 text-sm">Shipped</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-2xl font-bold text-amber-600">
                {orders.filter(o => o.status === 'Processing').length}
              </div>
              <div className="text-gray-500 text-sm">Processing</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full transition ${filter === "all" ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter("processing")}
              className={`px-4 py-2 rounded-full transition ${filter === "processing" ? 'bg-amber-100 text-amber-700' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter("shipped")}
              className={`px-4 py-2 rounded-full transition ${filter === "shipped" ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              Shipped
            </button>
            <button
              onClick={() => setFilter("delivered")}
              className={`px-4 py-2 rounded-full transition ${filter === "delivered" ? 'bg-green-100 text-green-700' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              Delivered
            </button>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedOrder(order)}
              >
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-2 rounded-full ${statusConfig.bg}`}>
                          {statusConfig.icon}
                        </div>
                        <span className={`font-semibold ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                      <p className="text-gray-500 text-sm">Ordered • {order.date}</p>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-x-1" />
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${statusConfig.progress}%` }}
                        transition={{ delay: 0.5 }}
                        className={`h-full ${statusConfig.bg.replace('bg-gradient-to-r', '').split(' ')[0]}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="flex -space-x-3 mb-4">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-white overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 bg-gray-800 rounded-lg border-2 border-white flex items-center justify-center">
                        <span className="text-white font-semibold">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-500 text-sm">x{item.qty}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-blue-600 text-sm font-medium">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">₹{order.amount}</p>
                      </div>
                      <button className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center gap-2">
                        View Details
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              Try changing your filter or check back later
            </p>
          </motion.div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}