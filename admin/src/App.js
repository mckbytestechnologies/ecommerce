import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import ProductForm from "./pages/Admin/ProductForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Page (for adding new products) */}
        <Route path="/admin/products/new" element={<ProductForm />} />
      </Routes>
    </Router>
  );
}

export default App;
