import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  MapPin,
  Package,
  CheckCircle,
  Clock,
  RefreshCw,
  Shield,
  Phone,
  AlertCircle,
  Download,
  Share2,
  Navigation,
  Home,
  Building,
  User,
  PhoneCall,
  Calendar,
  ChevronRight,
  X,
  Printer,
  MessageCircle,
  Globe
} from "lucide-react";

export default function ShippingTracker() {
  const [activeTab, setActiveTab] = useState("tracking");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [liveTracking, setLiveTracking] = useState(true);
  const [estimatedDelivery, setEstimatedDelivery] = useState("Today by 8 PM");

  // Simulate live tracking updates
  useEffect(() => {
    if (liveTracking) {
      const interval = setInterval(() => {
        // Simulate location updates
        console.log("Updating tracking data...");
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [liveTracking]);

  const orders = [
    {
      id: "ORD-58291",
      trackingId: "BLUEDART-3C82X9174",
      status: "delivered",
      statusText: "Delivered",
      carrier: "BlueDart Express",
      carrierLogo: "https://logo.clearbit.com/bluedart.com",
      service: "Express 24",
      weight: "1.2 kg",
      dimensions: "30 × 20 × 10 cm",
      timeline: [
        {
          id: 1,
          status: "delivered",
          title: "Delivered",
          description: "Delivered to reception/security",
          location: "Bangalore, Karnataka",
          time: "Today, 3:45 PM",
          completed: true
        },
        {
          id: 2,
          status: "out_for_delivery",
          title: "Out for delivery",
          description: "Your order is out for delivery",
          location: "Bangalore, Karnataka",
          time: "Today, 10:30 AM",
          completed: true
        },
        {
          id: 3,
          status: "arrived_at_hub",
          title: "Arrived at delivery hub",
          description: "Package arrived at local delivery hub",
          location: "Bangalore Sorting Center",
          time: "Today, 6:15 AM",
          completed: true
        },
        {
          id: 4,
          status: "in_transit",
          title: "In transit",
          description: "Package departed from Hyderabad hub",
          location: "Hyderabad to Bangalore",
          time: "Yesterday, 11:30 PM",
          completed: true
        },
        {
          id: 5,
          status: "shipped",
          title: "Shipped",
          description: "Package picked up by carrier",
          location: "Mumbai Warehouse",
          time: "Nov 29, 2:00 PM",
          completed: true
        },
        {
          id: 6,
          status: "order_placed",
          title: "Order placed",
          description: "Your order has been confirmed",
          location: "Online Store",
          time: "Nov 28, 11:30 AM",
          completed: true
        }
      ],
      deliveryAddress: {
        name: "John Doe",
        street: "123, Tech Park, 7th Cross",
        area: "Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560034",
        phone: "+91 98765 43210",
        type: "Home",
        landmark: "Near Forum Mall"
      },
      deliveryAgent: {
        name: "Rahul Kumar",
        phone: "+91 98765 12345",
        vehicle: "Bike",
        id: "DEL-824",
        rating: 4.8,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
      },
      proofOfDelivery: {
        image: "https://images.unsplash.com/photo-1589793462101-c5c0e1c8f041?w=400&h=300&fit=crop",
        signature: "Available",
        receivedBy: "Security Guard",
        time: "3:45 PM"
      }
    },
    {
      id: "ORD-58142",
      trackingId: "DELHIVERY-DL5829",
      status: "in_transit",
      statusText: "In Transit",
      carrier: "Delhivery",
      carrierLogo: "https://logo.clearbit.com/delhivery.com",
      service: "Surface",
      timeline: [
        {
          id: 1,
          status: "in_transit",
          title: "In transit",
          description: "Package is on the way to Bangalore",
          location: "Mumbai to Bangalore",
          time: "Today, 8:00 AM",
          completed: true
        },
        {
          id: 2,
          status: "departed",
          title: "Departed",
          description: "Package departed from Mumbai hub",
          location: "Mumbai Sorting Center",
          time: "Yesterday, 9:30 PM",
          completed: true
        },
        {
          id: 3,
          status: "processed",
          title: "Processed",
          description: "Package processed at Mumbai hub",
          location: "Mumbai Warehouse",
          time: "Nov 30, 4:15 PM",
          completed: true
        },
        {
          id: 4,
          status: "shipped",
          title: "Shipped",
          description: "Package picked up by carrier",
          location: "Seller Warehouse",
          time: "Nov 30, 11:00 AM",
          completed: true
        },
        {
          id: 5,
          status: "order_placed",
          title: "Order placed",
          description: "Your order has been confirmed",
          location: "Online Store",
          time: "Nov 29, 3:45 PM",
          completed: true
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-100";
      case "in_transit": return "text-blue-600 bg-blue-100";
      case "out_for_delivery": return "text-purple-600 bg-purple-100";
      case "shipped": return "text-amber-600 bg-amber-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <CheckCircle className="text-green-600" size={20} />;
      case "in_transit": return <Truck className="text-blue-600" size={20} />;
      case "out_for_delivery": return <Package className="text-purple-600" size={20} />;
      case "shipped": return <Truck className="text-amber-600" size={20} />;
      default: return <Clock className="text-gray-600" size={20} />;
    }
  };

  const TrackingCard = ({ order }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Truck className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-500">Tracking: {order.trackingId}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.statusText}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building size={14} />
                <span>{order.carrier}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package size={14} />
                <span>{order.service}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setSelectedOrder(order)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition flex items-center gap-2"
          >
            Track Details
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Order placed</span>
            <span>Delivered</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: order.status === 'delivered' ? '100%' : '60%' }}
              className={`h-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
            />
          </div>
        </div>
      </div>
      
      {/* Estimated Delivery */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="text-lg font-bold text-gray-900">{estimatedDelivery}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white rounded-lg transition">
              <Share2 size={18} />
            </button>
            <button className="p-2 hover:bg-white rounded-lg transition">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const TrackingDetailsModal = ({ order, onClose }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tracking Details</h2>
                <p className="text-gray-500">{order.trackingId} • {order.carrier}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
                <Printer size={18} />
                Print
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition flex items-center gap-2">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Timeline */}
              <div className="lg:col-span-2">
                {/* Delivery Status Card */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm opacity-90">Current Status</p>
                      <h3 className="text-2xl font-bold">{order.statusText}</h3>
                      <p className="text-sm opacity-90">Estimated: {estimatedDelivery}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      {getStatusIcon(order.status)}
                    </div>
                  </div>
                  
                  {/* Live Tracking Toggle */}
                  <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Navigation size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Live Tracking</p>
                        <p className="text-sm opacity-90">Updates every 30 seconds</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setLiveTracking(!liveTracking)}
                      className={`relative w-14 h-8 rounded-full transition ${liveTracking ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${liveTracking ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock size={20} />
                    Tracking History
                  </h3>
                  
                  <div className="space-y-6">
                    {order.timeline?.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {event.completed ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          {index < order.timeline.length - 1 && (
                            <div className={`w-0.5 h-full ${event.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                          )}
                        </div>
                        
                        {/* Event Details */}
                        <div className="flex-1 pb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{event.title}</h4>
                              <p className="text-gray-600">{event.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-500">{event.location}</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">{event.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Info Cards */}
              <div className="space-y-6">
                {/* Delivery Address */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Delivery Address
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="text-gray-400 mt-1" size={16} />
                      <div>
                        <p className="font-medium">{order.deliveryAddress?.name}</p>
                        <p className="text-sm text-gray-600">{order.deliveryAddress?.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Home className="text-gray-400 mt-1" size={16} />
                      <div>
                        <p className="text-gray-700">{order.deliveryAddress?.street}</p>
                        <p className="text-gray-700">{order.deliveryAddress?.area}</p>
                        <p className="text-gray-700">
                          {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                        </p>
                        {order.deliveryAddress?.landmark && (
                          <p className="text-sm text-gray-500 mt-1">
                            Landmark: {order.deliveryAddress?.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={16} />
                      <span className="text-gray-700">{order.deliveryAddress?.phone}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition">
                    Change Address
                  </button>
                </div>

                {/* Delivery Agent */}
                {order.deliveryAgent && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User size={20} />
                      Your Delivery Agent
                    </h3>
                    <div className="flex items-center gap-4">
                      <img 
                        src={order.deliveryAgent.photo} 
                        alt={order.deliveryAgent.name}
                        className="w-16 h-16 rounded-full border-2 border-white shadow"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{order.deliveryAgent.name}</p>
                        <p className="text-sm text-gray-600">ID: {order.deliveryAgent.id}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full mx-0.5 ${i < Math.floor(order.deliveryAgent.rating) ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{order.deliveryAgent.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                        <PhoneCall size={16} />
                        Call
                      </button>
                      <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                        <MessageCircle size={16} />
                        Message
                      </button>
                    </div>
                  </div>
                )}

                {/* Proof of Delivery */}
                {order.proofOfDelivery && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield size={20} />
                      Proof of Delivery
                    </h3>
                    <div className="space-y-3">
                      <img 
                        src={order.proofOfDelivery.image}
                        alt="Delivery proof"
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Received by:</span>
                          <span className="font-medium">{order.proofOfDelivery.receivedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{order.proofOfDelivery.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Signature:</span>
                          <span className="font-medium text-green-600">Verified ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Need Help?
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
                      <PhoneCall size={18} />
                      Contact Carrier
                    </button>
                    <button className="w-full py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
                      <MessageCircle size={18} />
                      Chat Support
                    </button>
                    <button className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition flex items-center justify-center gap-2">
                      <AlertCircle size={18} />
                      Report Issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Shipping & Tracking
                </h1>
                <p className="text-gray-600">
                  Track your packages in real-time
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter tracking ID..."
                    className="pl-4 pr-12 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1">
                    <RefreshCw className="text-gray-400" size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white p-1 rounded-2xl w-fit shadow-sm mb-8">
            {["tracking", "addresses", "preferences", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all capitalize ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "tracking" && "Live Tracking"}
                {tab === "addresses" && "My Addresses"}
                {tab === "preferences" && "Preferences"}
                {tab === "history" && "History"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-gray-500 text-sm">Active Shipments</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
            <div className="text-2xl font-bold text-green-600">48</div>
            <div className="text-gray-500 text-sm">Delivered</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-gray-500 text-sm">In Transit</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
            <div className="text-2xl font-bold text-amber-600">1</div>
            <div className="text-gray-500 text-sm">Delayed</div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {orders.map((order, index) => (
            <TrackingCard key={order.id} order={order} />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Need immediate help?</h3>
              <p className="opacity-90">Our support team is available 24/7</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2">
                <PhoneCall size={18} />
                Call Support
              </button>
              <button className="px-6 py-3 bg-white/20 rounded-xl font-bold hover:bg-white/30 transition flex items-center gap-2">
                <MessageCircle size={18} />
                Live Chat
              </button>
            </div>
          </div>
        </motion.div>

        {/* Partners */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Shipping Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {["BlueDart", "Delhivery", "DTDC", "FedEx", "DHL", "Amazon Shipping"].map((partner) => (
              <div key={partner} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition flex items-center justify-center">
                <div className="text-center">
                  <Truck className="mx-auto text-blue-600 mb-2" size={24} />
                  <span className="font-medium text-gray-700">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tracking Details Modal */}
      {selectedOrder && (
        <TrackingDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}