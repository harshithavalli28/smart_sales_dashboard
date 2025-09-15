//routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs"); // bcryptjs for Windows compatibility
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

// ======================= SIGNUP =======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check if user exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert new user with role
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    console.log("Login attempt:", email);
    console.log("DB user:", user);
    console.log("Password match:", match);

    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // ✅ Normalize role
    const roleMap = { "1": "admin", "2": "employee" };
    const normalizedRole = roleMap[user.role] || user.role;

    const token = jwt.sign(
      { id: user.id, role: normalizedRole },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login success, sending response:", {
      token,
      role: normalizedRole,
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      token,
      role: normalizedRole,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
