const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, permit } = require("../middleware/auth");

// Get all customers
router.get("/", authenticateToken, permit("employee", "admin"), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers");
    console.log("👉 Customers query result:", rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching customers:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add customer
router.post("/", authenticateToken, permit("employee"), async (req, res) => {
  const { name, email,phone,address } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO customers (name, email,phone,address) VALUES (?, ?,?,?)",
      [name, email,phone,address]
    );
    res.json({ id: result.insertId, name, email,phone,address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update customer
router.put("/:id", authenticateToken, permit("employee"), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    await pool.query(
      "UPDATE customers SET name=?, email=?, phone=?, address=? WHERE id=?",
      [name, email, phone, address, id]
    );
    res.json({ message: "Customer updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete customer
router.delete("/:id", authenticateToken, permit("employee"), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM customers WHERE id=?", [id]);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
