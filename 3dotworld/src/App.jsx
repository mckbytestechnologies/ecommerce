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

import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from './contexts/CartContext';
import GiftBox from "./components/GiftBox"; // Import GiftBox
import Addresses from "./pages/Profile/Addresses";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
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
             <Route path="/profile/addresses" element={<Addresses/>} />
            {/* Remove the GiftBox route - It's not a page! */}
            {/* <Route path="/GiftBox " element={<GiftBox />} /> */}
          </Routes>
          
          <Footer />
          
          {/* Add GiftBox here - It will float on ALL pages */}
          <GiftBox />
          
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;