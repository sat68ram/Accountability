import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = express.Router();

// Helper: generate JWT
function generateToken(user) {
  const payload = {
    sub: user.USER_ID,
    email: user.EMAIL,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
}

/**
 * POST /api/auth/register
 * body: { email, password }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase();

    // 1) Check if email exists
    const existing = await query(
      `SELECT USER_ID
         FROM AUTH_DB.AUTH_SCHEMA.USERS
        WHERE EMAIL = ?`,
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // 2) Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3) Insert user (Snowflake does not support RETURNING like Postgres)
    await query(
      `INSERT INTO AUTH_DB.AUTH_SCHEMA.USERS (EMAIL, PASSWORD_HASH)
       VALUES (?, ?)`,
      [normalizedEmail, passwordHash]
    );

    // 4) Fetch user to return
    const rows = await query(
      `SELECT USER_ID, EMAIL, CREATED_AT
         FROM AUTH_DB.AUTH_SCHEMA.USERS
        WHERE EMAIL = ?`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(500).json({ message: 'Failed to create user.' });
    }

    const user = rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.USER_ID,
        email: user.EMAIL,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase();

    // 1) Find user in Snowflake
    const rows = await query(
      `SELECT USER_ID, EMAIL, PASSWORD_HASH
         FROM AUTH_DB.AUTH_SCHEMA.USERS
        WHERE EMAIL = ?`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];

    // 2) Compare password
    const matches = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 3) Non-blocking update of LAST_LOGIN_AT
    query(
      `UPDATE AUTH_DB.AUTH_SCHEMA.USERS
          SET LAST_LOGIN_AT = CURRENT_TIMESTAMP()
        WHERE USER_ID = ?`,
      [user.USER_ID]
    ).catch((e) => console.error('Failed to update LAST_LOGIN_AT', e));

    // 4) Issue JWT
    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user.USER_ID,
        email: user.EMAIL,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
