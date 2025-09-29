// controllers/productController.js

// Get all products
export const getProducts = (req, res) => {
  res.json([
    { id: 1, name: "iPhone 15", price: 1200 },
    { id: 2, name: "Samsung Galaxy S24", price: 1000 }
  ]);
};

// Create a new product
export const createProduct = (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  res.status(201).json({
    message: "Product created successfully ✅",
    product: { id: Date.now(), name, price }
  });
};
