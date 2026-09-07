const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../db");

async function registerUser({
  name,
  email,
  password,
}) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const existingUser =
    await pool.query(
      `
        SELECT id
        FROM users
        WHERE email = $1
      `,
      [normalizedEmail]
    );

  if (existingUser.rows.length > 0) {
    throw new Error(
      "Email already registered"
    );
  }

  const passwordHash =
    await bcrypt.hash(password, 12);

  const result = await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `,
    [
      name.trim(),
      normalizedEmail,
      passwordHash,
    ]
  );

  return result.rows[0];
}

async function loginUser({
  email,
  password,
}) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash
      FROM users
      WHERE email = $1
    `,
    [normalizedEmail]
  );

  if (result.rows.length === 0) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const user = result.rows[0];

  const passwordValid =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!passwordValid) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};