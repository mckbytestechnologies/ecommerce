import {BrowserRouter,Route,Routes} from "react-router-dom";
import './App.css'
import Header from './components/Header';
import Home from './pages/Home';
import ProductListing from "./pages/ProductListing";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";
import AuthPage from "./pages/AuthPage";
import CartCheckout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import ShippingTracker from "./pages/Shipping";
import { User } from "lucide-react";
import RegisterPage from "./pages/Register";
import Wishlist from "./pages/wishlist";
import Cart from "./pages/Cart";
import WarrantyRegistration from "./pages/Home/WarrantyRegistration";
import CorporateGiftingPage from "./pages/Corporate Gifting";
import About3DotWorld from "./pages/About";
import ContactPage from "./pages/Contact";
import SheroesPage from "./pages/Sherose";

function App() {

  return (
    <>
    <BrowserRouter>

     <Header/>
     <Routes>
       <Route path={"/"} exact={true} element={<Home/>}/>
       <Route path={"/productlisting"} exact={true} element={<ProductListing/>}/>
       <Route path={"/productdetails/:id"} exact={true} element={<ProductDetails/>}/>
       <Route path={"/auth"} exact={true} element={<AuthPage/>}/>
       <Route path={"/register"} exact={true} element={<RegisterPage/>}/>
       <Route path={"/checkout"} exact={true} element={<CartCheckout/>}/>
       <Route path={"/my-order"} exact={true} element={<MyOrders/>}/>
       <Route path={"/shipping-tracking"} exact={true} element={<ShippingTracker/>}/>
      <Route path={"/my-account"} exact={true} element={<User/>}/>
      <Route path={"/wishlist"} exact={true} element={<Wishlist/>}/>
      <Route path={"/cart"} exact={true} element={<Cart/>}/>
      <Route path={"/warranty"} exact={true} element={<WarrantyRegistration/>}/>
      <Route path={"/corporating-gifting"} exact={true} element={<CorporateGiftingPage/>}/>
      <Route path={"/about"} exact={true} element={<About3DotWorld/>}/>
      <Route path={"/contact"} exact={true} element={<ContactPage/>}/>
      <Route path={"/sherose"} exact={true} element={<SheroesPage/>}/>
     </Routes>
     <Footer/>
     </BrowserRouter>
    </>
  )
}

export default App
