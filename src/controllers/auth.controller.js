const sql = require("../db");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt.util");
const config = require("../config");

// Register user
async function createUser(username, email, password) {
  const password_hash = await bcrypt.hash(password, config.bcryptSaltRounds);

  // Check if user exists
  const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username}`;
  if (existing.length) {
    throw { status: 409, message: "User with that email or username already exists" };
  }

  const inserted = await sql`
    INSERT INTO users (username, email, password_hash)
    VALUES (${username}, ${email}, ${password_hash})
    RETURNING id, username, email, role, created_at
  `;
  return inserted[0];
}

// Login user
async function authenticateUser(email, password) {
  const rows = await sql`SELECT id, username, email, password_hash, role FROM users WHERE email = ${email}`;
  const user = rows[0];
  if (!user) throw { status: 401, message: "Invalid credentials" };

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw { status: 401, message: "Invalid credentials" };

  delete user.password_hash;
  return user;
}

module.exports = { createUser, authenticateUser };
