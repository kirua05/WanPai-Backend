const db = require('../config/db');

async function getProductById(id) {
  const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}
