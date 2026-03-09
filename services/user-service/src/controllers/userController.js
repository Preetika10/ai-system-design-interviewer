import pool from "../config/db.js";
import bcrypt  from "bcryptjs";

// Register user
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
    [name, email, hashedPassword]
  );

  res.json(result.rows[0]);
}

// Login User
import jwt from "jsonwebtoken";

export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (user.rows.length === 0) {
    return res.status(400).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(
    password,
    user.rows[0].password
  );

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.rows[0].id },
    "secret",
    { expiresIn: "1d" }
  );

  res.json({ token });
}

export async function getProfile(req, res) {
  try {
    const user = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};