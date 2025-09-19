const sql = require("../db");

// Add a new sweet
async function addSweet({ name, category, price, quantity }) {
  const inserted = await sql`
    INSERT INTO sweets (name, category, price, quantity)
    VALUES (${name}, ${category}, ${price}, ${quantity})
    RETURNING *;
  `;
  return inserted[0];
}

// Get all sweets
async function getAllSweets() {
  return await sql`SELECT * FROM sweets ORDER BY created_at DESC;`;
}

// Search sweets by name, category, or price range
async function searchSweets({ name, category, minPrice, maxPrice }) {
  let query = sql`SELECT * FROM sweets WHERE TRUE`;
  if (name) query = sql`${query} AND name ILIKE ${'%' + name + '%'}`;
  if (category) query = sql`${query} AND category = ${category}`;
  if (minPrice) query = sql`${query} AND price >= ${minPrice}`;
  if (maxPrice) query = sql`${query} AND price <= ${maxPrice}`;
  return await query;
}

// Update sweet by ID
async function updateSweet(id, { name, category, price, quantity }) {
  const updated = await sql`
  UPDATE sweets
  SET name = COALESCE(${name ?? null}, name),
      category = COALESCE(${category ?? null}, category),
      price = COALESCE(${price ?? null}, price),
      quantity = COALESCE(${quantity ?? null}, quantity),
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ${id}
  RETURNING *;
`;

  return updated[0];
}

// Delete sweet by ID
async function deleteSweet(id) {
  const deleted = await sql`
    DELETE FROM sweets WHERE id = ${id} RETURNING *;
  `;
  return deleted[0];
}

module.exports = {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
};
