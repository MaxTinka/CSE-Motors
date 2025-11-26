const pool = require("../database/")

const invModel = {}

/* ***************************
 *  Get all classifications
 * ************************** */
invModel.getClassifications = async function () {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("getClassifications error: " + error)
    return null
  }
}

/* ***************************
 *  Get inventory by classification_id
 * ************************** */
invModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const sql = `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`
    const data = await pool.query(sql, [classification_id])
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
    return null
  }
}

/* ***************************
 *  Get inventory by inventory_id
 * ************************** */
invModel.getInventoryByInventoryId = async function (inventory_id) {
  try {
    const sql = `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`
    const data = await pool.query(sql, [inventory_id])
    return data.rows
  } catch (error) {
    console.error("getInventoryByInventoryId error: " + error)
    return null
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
invModel.addClassification = async function (classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error: " + error)
    return null
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
invModel.addInventory = async function (
  classification_id,
  inv_make,
  inv_model, 
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color
) {
  try {
    const sql = `INSERT INTO inventory (
      classification_id, inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    
    const result = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model, 
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addInventory error: " + error)
    return null
  }
}

/* ***************************
 *  Update inventory item
 * ************************** */
invModel.updateInventory = async function (
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `UPDATE inventory SET 
      inv_make = $1, 
      inv_model = $2, 
      inv_year = $3, 
      inv_description = $4, 
      inv_image = $5, 
      inv_thumbnail = $6, 
      inv_price = $7, 
      inv_miles = $8, 
      inv_color = $9, 
      classification_id = $10 
      WHERE inv_id = $11 
      RETURNING *`
    
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return result.rows[0]
  } catch (error) {
    console.error("updateInventory error: " + error)
    return null
  }
}

/* ***************************
 *  Delete inventory item
 * ************************** */
invModel.deleteInventory = async function (inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *"
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("deleteInventory error: " + error)
    return null
  }
}

/* ***************************
 *  Check if classification has inventory items
 * ************************** */
invModel.checkClassificationHasInventory = async function (classification_id) {
  try {
    const sql = "SELECT COUNT(*) FROM inventory WHERE classification_id = $1"
    const result = await pool.query(sql, [classification_id])
    return parseInt(result.rows[0].count) > 0
  } catch (error) {
    console.error("checkClassificationHasInventory error: " + error)
    return false
  }
}

/* ***************************
 *  Delete classification
 * ************************** */
invModel.deleteClassification = async function (classification_id) {
  try {
    const sql = "DELETE FROM classification WHERE classification_id = $1 RETURNING *"
    const result = await pool.query(sql, [classification_id])
    return result.rows[0]
  } catch (error) {
    console.error("deleteClassification error: " + error)
    return null
  }
}

module.exports = invModel
