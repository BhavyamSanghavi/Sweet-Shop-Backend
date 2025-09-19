const express = require("express");
const router = express.Router();
const { registerSchema, loginSchema } = require("../utils/validators");
const authController = require("../controllers/auth.controller");
const { signToken } = require("../utils/jwt.util");
const { authLimiter } = require("../middleware/rate.middleware");

// POST /api/auth/register
router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, email, password } = value;
    const user = await authController.createUser(username, email, password);
    const token = signToken({ id: user.id, role: user.role });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = value;
    const user = await authController.authenticateUser(email, password);
    const token = signToken({ id: user.id, role: user.role });
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
