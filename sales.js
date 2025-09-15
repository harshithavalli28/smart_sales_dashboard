const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, permit } = require("../middleware/auth");

// Get all sales with customer & product details
// sales.js
router.get("/", authenticateToken, permit("employee", "admin"), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, c.name AS customer, p.name AS product, s.quantity, (s.quantity * p.price) AS total
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      JOIN products p ON s.product_id = p.id
    `);
    console.log("👉 Sales query result:", rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching sales:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// Add sale
router.post("/", authenticateToken, permit("employee"), async (req, res) => {
  const { customer_id, product_id, quantity, sale_date } = req.body;
  try {
    // get product price
    const [product] = await pool.query("SELECT price FROM products WHERE id=?", [product_id]);
    if (product.length === 0) return res.status(400).json({ error: "Invalid product" });

    const total = product[0].price * quantity;

    const [result] = await pool.query(
      "INSERT INTO sales (customer_id, product_id, quantity, total, sale_date) VALUES (?, ?, ?, ?, ?)",
      [customer_id, product_id, quantity, total, sale_date]
    );
    // update stock
    await pool.query("UPDATE products SET stock = stock - ? WHERE id = ?", [quantity, product_id]);
    res.json({ id: result.insertId, customer_id, product_id, quantity, total, sale_date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete sale
router.delete("/:id", authenticateToken, permit("employee"), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM sales WHERE id=?", [id]);
    res.json({ message: "Sale deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;