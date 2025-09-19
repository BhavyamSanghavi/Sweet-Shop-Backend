const express = require("express");
const router = express.Router();
const { purchaseSweet, restockSweet } = require("../controllers/inventory.controller");
const { auth, adminOnly } = require("../middleware/auth.middleware");

// Purchase sweet (protected)
router.post("/:id/purchase", auth, async (req, res, next) => {
  try {
    const quantity = parseInt(req.body.quantity || 1, 10);
    const sweet = await purchaseSweet(req.params.id, quantity);
    res.json({ message: `Purchased ${quantity} item(s)`, sweet });
  } catch (err) {
    next(err);
  }
});

// Restock sweet (admin only)
router.post("/:id/restock", auth, adminOnly, async (req, res, next) => {
  try {
    const quantity = parseInt(req.body.quantity || 1, 10);
    const sweet = await restockSweet(req.params.id, quantity);
    res.json({ message: `Restocked ${quantity} item(s)`, sweet });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
