const bcrypt = require("bcryptjs");
const pool = require("./db");

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert roles
    await pool.query("INSERT IGNORE INTO roles (id, name) VALUES (1, 'admin'), (2, 'employee')");

    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    await pool.query(
      "INSERT IGNORE INTO users (id, name, email, password, role_id) VALUES (?, ?, ?, ?, ?)",
      [1, "Admin", "admin@example.com", hashedPassword, 1]
    );

    console.log("✅ Seeding completed!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  }
}

seed();
