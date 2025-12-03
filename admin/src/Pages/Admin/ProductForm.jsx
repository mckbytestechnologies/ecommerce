import React, { useState } from "react";
import { createProduct } from "../../api/productService";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(product);
      alert("✅ Product created successfully!");
      console.log(res);
    } catch (error) {
      console.error(error);
      alert("❌ Error creating product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
      <input name="price" placeholder="Price" type="number" onChange={handleChange} />
      <input name="category" placeholder="Category ID" onChange={handleChange} />
      <input name="stock" placeholder="Stock" type="number" onChange={handleChange} />
      <input type="file" multiple onChange={handleImageChange} />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
