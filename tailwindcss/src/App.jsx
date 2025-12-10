import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';

import Header from './components/Header';
import Home from './pages/Home';
import ProductListing from "./pages/ProductListing";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";
import AuthPage from "./pages/AuthPage";
import CartCheckout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import ShippingTracker from "./pages/Shipping";
import RegisterPage from "./pages/Register";
import Wishlist from "./pages/wishlist";
import Cart from "./pages/Cart";
import WarrantyRegistration from "./pages/Home/WarrantyRegistration";
import CorporateGiftingPage from "./pages/Corporate Gifting";
import About3DotWorld from "./pages/About";
import ContactPage from "./pages/Contact";
import SheroesPage from "./pages/Sherose";

import { WishlistProvider } from "./context/WishlistContext";   // ✅ IMPORTANT

function App() {
  return (
    <BrowserRouter>

      {/* ✅ Wrap everything inside WishlistProvider */}
      <WishlistProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productlisting" element={<ProductListing />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CartCheckout />} />
          <Route path="/my-order" element={<MyOrders />} />
          <Route path="/shipping-tracking" element={<ShippingTracker />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/warranty" element={<WarrantyRegistration />} />
          <Route path="/corporating-gifting" element={<CorporateGiftingPage />} />
          <Route path="/about" element={<About3DotWorld />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sherose" element={<SheroesPage />} />
        </Routes>

        <Footer />
      </WishlistProvider>

    </BrowserRouter>
  );
}

export default App;
