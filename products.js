const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, permit } = require("../middleware/auth");

// Get all products
router.get("/", authenticateToken, permit("employee", "admin"), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    console.log("👉 Products query result:", rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add product
router.post("/", authenticateToken, permit("employee"), async (req, res) => {
  const { name, category, price, stock } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)",
      [name, category, price, stock]
    );
    res.json({ id: result.insertId, name, category, price, stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put("/:id", authenticateToken, permit("employee"), async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;
  try {
    await pool.query(
      "UPDATE products SET name=?, category=?, price=?, stock=? WHERE id=?",
      [name, category, price, stock, id]
    );
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", authenticateToken, permit("employee"), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id=?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;