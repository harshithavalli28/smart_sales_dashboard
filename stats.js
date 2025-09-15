const express = require("express");
const router = express.Router();
const db = require("../db"); // adjust path to your db.js
const { authenticateToken, permit } = require("../middleware/auth");

// 📊 Monthly Revenue
router.get("/monthly-revenue", authenticateToken, permit("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, 
             SUM(quantity * price) AS revenue
      FROM sales
      JOIN products ON sales.product_id = products.id
      GROUP BY month
      ORDER BY month
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch revenue" });
  }
});

// 🥇 Top Products
router.get("/top-products", authenticateToken, permit("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.name, SUM(s.quantity * p.price) AS revenue
      FROM sales s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.id
      ORDER BY revenue DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
});

// 👥 Top Customers (by total spend)
router.get("/top-customers", authenticateToken, permit("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.name, SUM(s.quantity * p.price) AS total_spent
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      JOIN products p ON s.product_id = p.id
      GROUP BY c.id
      ORDER BY total_spent DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Top customers error:", err.message);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// 📈 Sales Growth (monthly count of sales)
router.get("/sales-growth", authenticateToken, permit("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(sale_date, '%Y-%m') AS month, COUNT(*) AS sales_count
      FROM sales
      GROUP BY month
      ORDER BY month
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Sales growth error:", err.message);
    res.status(500).json({ error: "Failed to fetch sales growth" });
  }
});


// 🛒 Sales by Category
router.get("/sales-by-category", authenticateToken, permit("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.category, SUM(s.quantity * p.price) AS revenue
      FROM sales s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.category
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Sales by category error:", err.message);
    res.status(500).json({ error: "Failed to fetch sales by category" });
  }
});

// 🌍 Sales by Region
router.get("/sales-by-region", authenticateToken, permit("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.address, SUM(s.quantity * p.price) AS revenue
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      JOIN products p ON s.product_id = p.id
      GROUP BY c.address
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Sales by region error:", err.message);
    res.status(500).json({ error: "Failed to fetch sales by region" });
  }
});

// 📅 Daily Sales Trend (last 30 days)
router.get("/daily-sales", authenticateToken, permit("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(s.sale_date) AS day, SUM(s.quantity * p.price) AS revenue
      FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE s.sale_date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY day
      ORDER BY day
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Daily sales error:", err.message);
    res.status(500).json({ error: "Failed to fetch daily sales" });
  }
});

// 🧑‍🤝‍🧑 Customer Acquisition Trend
router.get("/customer-acquisition", authenticateToken, permit("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS new_customers
      FROM customers
      GROUP BY month
      ORDER BY month
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Customer acquisition error:", err.message);
    res.status(500).json({ error: "Failed to fetch customer acquisition" });
  }
});

module.exports = router;
