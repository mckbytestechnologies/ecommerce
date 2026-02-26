import React, { useState, useEffect } from "react";
import axios from "axios";
import ElectronicsItem from "./ElectronicsItem";
import "./ElectronicsCategory.css";

const ElectronicsCategory = () => {
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch only electronics products
  useEffect(() => {
    const fetchElectronicsProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/products");
        
        if (response.data.success) {
          // Filter products to show only electronics
          const electronics = response.data.products.filter(product => 
            product.category === "Electronics" || 
            product.category.toLowerCase().includes("electronic") ||
            // Add more electronics-related categories if needed
            product.category === "Smartphones" ||
            product.category === "Laptops" ||
            product.category === "Headphones" ||
            product.category === "Cameras" ||
            product.category === "Smart Watches" ||
            product.category === "Tablets" ||
            product.category === "Gaming" ||
            product.category === "Accessories"
          );
          
          setElectronicsProducts(electronics);
        }
      } catch (error) {
        setError("Failed to fetch electronics products");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElectronicsProducts();
  }, []);

  if (loading) {
    return (
      <div className="electronics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading electronics products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="electronics-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="electronics-category-page">
      {/* HEADER SECTION */}
      <div className="electronics-header">
        <h1 className="electronics-title">Electronics & Gadgets</h1>
        <p className="electronics-subtitle">
          Discover the latest tech gadgets, smartphones, laptops, and more
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="electronics-grid-container">
        {electronicsProducts.length === 0 ? (
          <div className="no-products">
            <p>No electronics products available at the moment.</p>
          </div>
        ) : (
          <div className="electronics-grid">
            {electronicsProducts.map((product) => (
              <div key={product._id || product.id} className="electronics-item-wrapper">
                <ElectronicsItem
                  productId={product._id || product.id}
                  imageFront={product.images?.[0] || product.image || "default-image.jpg"}
                  imageBack={product.images?.[1] || product.image || "default-image.jpg"}
                  category={product.category || "Electronics"}
                  title={product.name || product.title}
                  rating={product.rating || product.averageRating || 0}
                  oldPrice={product.originalPrice || product.price}
                  newPrice={product.discountedPrice || product.price}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectronicsCategory;