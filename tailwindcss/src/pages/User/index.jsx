import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  Bell,
  Heart,
  MapPin,
  Lock,
  ShoppingBag,
  Package,
  CreditCard,
  Shield,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Plus,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Tag,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Wifi,
  Users,
  Database,
  Activity
} from "lucide-react";

export default function UserAccountDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    memberSince: "Jan 2023",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  });

  // Mock Data
  const dashboardStats = [
    { label: "Total Orders", value: "48", change: "+12%", icon: <ShoppingBag />, color: "blue" },
    { label: "Wishlist Items", value: "12", change: "+3", icon: <Heart />, color: "pink" },
    { label: "Total Spent", value: "₹24,899", change: "+18%", icon: <DollarSign />, color: "green" },
    { label: "Saved Addresses", value: "3", change: "+1", icon: <MapPin />, color: "purple" }
  ];

  const recentOrders = [
    { id: "ORD-58291", date: "28 Nov 2025", status: "Delivered", amount: 149.99, items: 2 },
    { id: "ORD-58142", date: "22 Nov 2025", status: "Shipped", amount: 89.50, items: 1 },
    { id: "ORD-58010", date: "18 Nov 2025", status: "Processing", amount: 39.99, items: 1 },
    { id: "ORD-57985", date: "15 Nov 2025", status: "Delivered", amount: 245.75, items: 3 }
  ];

  const wishlistItems = [
    { id: 1, name: "iPhone 15 Pro", price: 129999, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop", inStock: true },
    { id: 2, name: "MacBook Air M2", price: 114999, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop", inStock: true },
    { id: 3, name: "AirPods Pro", price: 24999, image: "https://images.unsplash.com/photo-1591370264374-9a5d8aec8c0b?w=200&h=200&fit=crop", inStock: false },
    { id: 4, name: "Apple Watch Series 9", price: 45999, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop", inStock: true }
  ];

  const savedAddresses = [
    { id: 1, type: "Home", name: "John Doe", address: "123, Tech Park, 7th Cross, Koramangala", city: "Bangalore", pincode: "560034", phone: "+91 98765 43210", default: true },
    { id: 2, type: "Work", name: "John Doe", address: "456, Corporate Tower, MG Road", city: "Bangalore", pincode: "560001", phone: "+91 98765 43210", default: false },
    { id: 3, type: "Parent's Home", name: "Robert Doe", address: "789, Green Valley, Whitefield", city: "Bangalore", pincode: "560066", phone: "+91 87654 32109", default: false }
  ];

  const notificationTypes = [
    { id: 1, type: "order", label: "Order Updates", enabled: true },
    { id: 2, type: "promotion", label: "Promotions & Offers", enabled: true },
    { id: 3, type: "security", label: "Security Alerts", enabled: true },
    { id: 4, type: "newsletter", label: "Newsletter", enabled: false }
  ];

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <Activity /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBag /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart /> },
    { id: "addresses", label: "Saved Addresses", icon: <MapPin /> },
    { id: "profile", label: "Profile Settings", icon: <User /> },
    { id: "security", label: "Security", icon: <Lock /> },
    { id: "notifications", label: "Notifications", icon: <Bell /> },
    { id: "preferences", label: "Preferences", icon: <Settings /> }
  ];

  // Load notifications
  useEffect(() => {
    const mockNotifications = [
      { id: 1, title: "Order Delivered", message: "Your order ORD-58291 has been delivered", time: "2 hours ago", read: false, type: "order" },
      { id: 2, title: "Special Offer", message: "Get 30% off on electronics this weekend", time: "1 day ago", read: true, type: "promotion" },
      { id: 3, title: "Security Alert", message: "New login detected from Mumbai", time: "2 days ago", read: false, type: "security" },
      { id: 4, title: "Payment Successful", message: "Payment of ₹1,499 completed", time: "3 days ago", read: true, type: "order" }
    ];
    setNotifications(mockNotifications);
  }, []);

  const Sidebar = () => (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: sidebarOpen ? 0 : -300 }}
      className={`fixed md:relative h-screen bg-gradient-to-b from-gray-900 to-black text-white z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}
    >
      <div className="p-6">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-8">
          <img 
            src={userData.avatar} 
            alt={userData.name}
            className="w-12 h-12 rounded-full border-2 border-blue-500"
          />
          <div>
            <h3 className="font-bold">{userData.name}</h3>
            <p className="text-sm text-gray-400">{userData.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && (
                <ChevronRight className="ml-auto" size={16} />
              )}
            </button>
          ))}
        </nav>

        {/* Account Level */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-blue-400" size={20} />
            <span className="font-medium">Gold Member</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-gradient-to-r from-yellow-500 to-orange-500" />
          </div>
          <p className="text-xs text-gray-400 mt-2">₹5,301 to Platinum</p>
        </div>

        {/* Logout Button */}
        <button className="w-full mt-8 flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );

  const DashboardHome = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {userData.name}!</h1>
            <p className="opacity-90">Member since {userData.memberSince} • Gold Tier</p>
          </div>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2">
            <ShoppingCart size={18} />
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-100 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium text-${stat.color}-600`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <button 
              onClick={() => setActiveSection("orders")}
              className="text-blue-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="text-gray-400" size={18} />
                    <div>
                      <h3 className="font-medium text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-500">{order.date} • {order.items} item(s)</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">₹{order.amount}</div>
                  <button className="mt-2 text-sm text-blue-600 hover:text-red-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveSection("profile")}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <User size={20} />
                </div>
                <span className="font-medium">Edit Profile</span>
              </div>
              <ChevronRight className="text-gray-400" size={16} />
            </button>

            <button 
              onClick={() => setActiveSection("wishlist")}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-pink-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                  <Heart size={20} />
                </div>
                <span className="font-medium">View Wishlist</span>
              </div>
              <ChevronRight className="text-gray-400" size={16} />
            </button>

            <button 
              onClick={() => setActiveSection("addresses")}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <MapPin size={20} />
                </div>
                <span className="font-medium">Manage Addresses</span>
              </div>
              <ChevronRight className="text-gray-400" size={16} />
            </button>

            <button 
              onClick={() => setActiveSection("security")}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Lock size={20} />
                </div>
                <span className="font-medium">Security Settings</span>
              </div>
              <ChevronRight className="text-gray-400" size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const MyOrders = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
          <p className="text-gray-600">Track, return, or buy things again</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Orders</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>2025</option>
          </select>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition">
            <Download className="inline mr-2" size={18} />
            Export Orders
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">Order ID</th>
                <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Items</th>
                <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="p-4 text-gray-600">{order.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{order.items} item(s)</td>
                  <td className="p-4 font-bold text-gray-900">₹{order.amount}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm font-medium">
                        Track
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                        Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const Wishlist = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <p className="text-gray-600">{wishlistItems.length} items saved for later</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-bold hover:opacity-90 transition">
            <Tag className="inline mr-2" size={18} />
            View All Deals
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              {!item.inStock && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Out of Stock
                </div>
              )}
              <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
                <Heart className="text-pink-500" size={20} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</div>
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg font-medium transition ${
                  item.inStock 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}>
                  {item.inStock ? 'Add to Cart' : 'Notify Me'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const SavedAddresses = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition flex items-center gap-2">
          <Plus size={20} />
          Add New Address
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedAddresses.map((address) => (
          <div key={address.id} className={`bg-white rounded-2xl shadow-sm border-2 p-5 transition-all ${
            address.default ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  address.type === 'Home' ? 'bg-blue-100 text-blue-700' :
                  address.type === 'Work' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {address.type}
                </span>
                {address.default && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-red-600 transition">
                  <Edit size={18} />
                </button>
                {!address.default && (
                  <button className="p-2 text-gray-400 hover:text-red-600 transition">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-bold text-gray-900">{address.name}</p>
                <p className="text-gray-700 mt-2">{address.address}</p>
                <p className="text-gray-600">{address.city} - {address.pincode}</p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span>{address.phone}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Edit
                </button>
                {!address.default && (
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Set Default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-blue-400 transition cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="text-blue-600" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Add New Address</h3>
          <p className="text-gray-500 text-center">Add a new delivery address for faster checkout</p>
        </div>
      </div>
    </motion.div>
  );

  const ProfileSettings = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <img 
                  src={userData.avatar} 
                  alt={userData.name}
                  className="w-20 h-20 rounded-full border-2 border-blue-500"
                />
                <div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Change Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={userData.name}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={userData.email}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    defaultValue={userData.phone}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Kannada</option>
                  <option>Tamil</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={24} />
              <div>
                <h3 className="font-bold">Gold Member</h3>
                <p className="text-sm opacity-90">Since {userData.memberSince}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to Platinum</span>
                <span>75%</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-gradient-to-r from-yellow-500 to-orange-500" />
              </div>
              <p className="text-xs opacity-90">₹5,301 more to upgrade</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium">
                Download My Data
              </button>
              <button className="w-full py-3 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition font-medium">
                Delete Account
              </button>
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:opacity-90 transition">
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );

  const ChangePassword = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
        <p className="text-gray-600">Update your password to keep your account secure</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>8+ characters</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>1 uppercase</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>1 number</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>1 special character</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-blue-500" size={20} />
              <p className="text-sm text-gray-600">
                Make sure your new password is strong and different from previous passwords.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition">
                Update Password
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const Notifications = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Manage your notification preferences</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
          >
            Mark all as read
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition">
            Clear All
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Notification List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">All</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Unread</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Orders</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Promotions</button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 transition ${!notification.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'promotion' ? 'bg-purple-100 text-purple-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      <Bell size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{notification.title}</h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">{notification.time}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full ml-auto mt-1"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                          View Details
                        </button>
                        <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {notificationTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">Receive {type.label.toLowerCase()}</p>
                  </div>
                  <button 
                    onClick={() => console.log('Toggle', type.type)}
                    className={`relative w-12 h-6 rounded-full transition ${type.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${type.enabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-green-500">
                  <span className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-purple-600" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">On this device</p>
                  </div>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-green-500">
                  <span className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium">SMS</p>
                    <p className="text-sm text-gray-500">{userData.phone}</p>
                  </div>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-gray-300">
                  <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const Preferences = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
        <p className="text-gray-600">Customize your account experience</p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Theme & Display</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500">Switch between light and dark themes</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="relative w-14 h-8 rounded-full bg-gray-300"
              >
                <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${darkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English (US)</option>
                <option>Hindi</option>
                <option>Kannada</option>
                <option>Tamil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>IST (India Standard Time)</option>
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Privacy & Data</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Show Online Status</p>
                <p className="text-sm text-gray-500">Let others see when you're online</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-green-500">
                <span className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Personalized Ads</p>
                <p className="text-sm text-gray-500">Show ads based on your interests</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-gray-300">
                <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Data Sharing</p>
                <p className="text-sm text-gray-500">Share analytics with partners</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-gray-300">
                <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition">
          Save Preferences
        </button>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardHome />;
      case "orders": return <MyOrders />;
      case "wishlist": return <Wishlist />;
      case "addresses": return <SavedAddresses />;
      case "profile": return <ProfileSettings />;
      case "security": return <ChangePassword />;
      case "notifications": return <Notifications />;
      case "preferences": return <Preferences />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100"
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
            <h1 className="text-xl font-bold">Account Dashboard</h1>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-600">
                Manage your account and preferences
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-3">
                <img 
                  src={userData.avatar} 
                  alt={userData.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="hidden md:block">
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-sm text-gray-500">Gold Member</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}