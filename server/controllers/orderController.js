// controllers/orderController.js

// Get all orders
export const getOrders = (req, res) => {
  res.json([
    { id: 1, user: "John Doe", total: 200, status: "Pending" },
    { id: 2, user: "Jane Smith", total: 500, status: "Completed" }
  ]);
};

// Create a new order
export const createOrder = (req, res) => {
  const { user, total } = req.body;

  if (!user || !total) {
    return res.status(400).json({ message: "User and total are required" });
  }

  res.status(201).json({
    message: "Order created successfully ✅",
    order: { id: Date.now(), user, total, status: "Pending" }
  });
};
