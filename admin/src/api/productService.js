import axios from "./axios";

// Get all products
export const getProducts = async () => {
  const res = await axios.get("/products");
  return res.data;
};

// Create product (with image upload)
export const createProduct = async (productData) => {
  const formData = new FormData();
  for (const key in productData) {
    if (key === "images") {
      productData.images.forEach((img) => formData.append("images", img));
    } else {
      formData.append(key, productData[key]);
    }
  }

  const res = await axios.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  for (const key in productData) {
    if (key === "images") {
      productData.images.forEach((img) => formData.append("images", img));
    } else {
      formData.append(key, productData[key]);
    }
  }

  const res = await axios.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};

// Get categories (optional)
export const getCategories = async () => {
  const res = await axios.get("/categories");
  return res.data;
};
