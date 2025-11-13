const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production'
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Inventory model methods
const inventoryModel = {
  // Get all inventory items
  async getAllInventory() {
    try {
      const result = await pool.query(`
        SELECT * FROM inventory 
        ORDER BY inv_id
      `);
      return result.rows;
    } catch (error) {
      console.error('Error getting inventory:', error);
      throw error;
    }
  },

  // Get inventory by ID
  async getInventoryById(invId) {
    try {
      const result = await pool.query(`
        SELECT * FROM inventory 
        WHERE inv_id = $1
      `, [invId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting inventory by ID:', error);
      throw error;
    }
  },

  // Update inventory item
  async updateInventory(invId, updateData) {
    try {
      const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = updateData;
      const result = await pool.query(`
        UPDATE inventory 
        SET inv_make = $1, inv_model = $2, inv_year = $3, 
            inv_description = $4, inv_price = $5, inv_miles = $6, inv_color = $7
        WHERE inv_id = $8
        RETURNING *
      `, [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, invId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  }
};

module.exports = { pool, inventoryModel };