const pool = require("../database/");

// Get vehicle by ID
inventoryModel.getInventoryById = async function (inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error: " + error);
  }
};
