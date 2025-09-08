const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// In-memory data with real product images
let items = [
  {
    id: 1,
    name: "Shirt",
    price: 1200,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Laptop",
    price: 45000,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Book",
    price: 500,
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
  },

  {
    id: 4,
    name: "Shoes",
    price: 2500,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=300&fit=crop",
  },
];
let cart = [];

// ---------------- API ROUTES ----------------

// Get items with optional filters
app.get("/api/items", (req, res) => {
  const { category, price } = req.query;
  let filtered = items;

  if (category) {
    filtered = filtered.filter(
      (i) => i.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (price) {
    filtered = filtered.filter((i) => i.price <= Number(price));
  }

  res.json(filtered);
});

// Add to cart
app.post("/api/items/cart", (req, res) => {
  const item = req.body;
  if (!cart.find((i) => i.id === item.id)) {
    cart.push(item);
  }
  res.json(item);
});

// View cart
app.get("/api/items/cart", (req, res) => {
  res.json(cart);
});

// Remove from cart
app.delete("/api/items/cart/:id", (req, res) => {
  const id = parseInt(req.params.id);
  cart = cart.filter((i) => i.id !== id);
  res.json({ message: "Removed from cart" });
});

// ---------------- FALLBACK ----------------
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
