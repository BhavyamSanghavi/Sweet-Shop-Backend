const sql = require("../db");

// Purchase a sweet: decrease quantity
async function purchaseSweet(id, quantity = 1) {
  // Check current quantity
  const sweet = await sql`SELECT * FROM sweets WHERE id = ${id}`;
  if (!sweet.length) throw { status: 404, message: "Sweet not found" };

  const currentQty = sweet[0].quantity;
  if (currentQty < quantity) throw { status: 400, message: "Not enough stock" };

  // Update quantity
  const updated = await sql`
    UPDATE sweets
    SET quantity = quantity - ${quantity},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *;
  `;
  return updated[0];
}

// Restock a sweet: increase quantity (Admin only)
async function restockSweet(id, quantity = 1) {
  const sweet = await sql`SELECT * FROM sweets WHERE id = ${id}`;
  if (!sweet.length) throw { status: 404, message: "Sweet not found" };

  const updated = await sql`
    UPDATE sweets
    SET quantity = quantity + ${quantity},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *;
  `;
  return updated[0];
}

module.exports = { purchaseSweet, restockSweet };
