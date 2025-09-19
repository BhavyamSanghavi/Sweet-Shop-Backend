const express = require("express");
const router = express.Router();
const sweetsController = require("../controllers/sweets.controller");
const { auth, adminOnly } = require("../middleware/auth.middleware");

// POST /api/sweets - add a new sweet (protected)
router.post("/", auth, async (req, res, next) => {
  try {
    const sweet = await sweetsController.addSweet(req.body);
    res.status(201).json(sweet);
  } catch (err) {
    next(err);
  }
});

// GET /api/sweets - get all sweets (protected)
router.get("/", auth, async (req, res, next) => {
  try {
    const sweets = await sweetsController.getAllSweets();
    res.json(sweets);
  } catch (err) {
    next(err);
  }
});

// GET /api/sweets/search - search sweets (protected)
router.get("/search", auth, async (req, res, next) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const results = await sweetsController.searchSweets({ name, category, minPrice, maxPrice });
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// PUT /api/sweets/:id - update sweet (protected)
router.put("/:id", auth, async (req, res, next) => {
  try {
    const sweet = await sweetsController.updateSweet(req.params.id, req.body);
    if (!sweet) return res.status(404).json({ error: "Sweet not found" });
    res.json(sweet);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/sweets/:id - delete sweet (Admin only)
router.delete("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const sweet = await sweetsController.deleteSweet(req.params.id);
    if (!sweet) return res.status(404).json({ error: "Sweet not found" });
    res.json({ message: "Sweet deleted", sweet });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
