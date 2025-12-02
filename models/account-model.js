const pool = require("../database/");
const bcrypt = require("bcryptjs");

const accountModel = {};

/* ***************************
 * Get account by ID
 * ************************** */
accountModel.getAccountById = async function (account_id) {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error:", error);
    return null;
  }
};

/* ***************************
 * Update account information
 * ************************** */
accountModel.updateAccount = async function (
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const sql = `UPDATE account 
      SET account_firstname = $1, 
          account_lastname = $2, 
          account_email = $3
      WHERE account_id = $4 
      RETURNING *`;
    
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("updateAccount error:", error);
    return null;
  }
};

/* ***************************
 * Update account password
 * ************************** */
accountModel.updatePassword = async function (account_id, hashedPassword) {
  try {
    const sql = `UPDATE account 
      SET account_password = $1
      WHERE account_id = $2 
      RETURNING *`;
    
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("updatePassword error:", error);
    return null;
  }
};

/* ***************************
 * Check if email exists (excluding current account)
 * ************************** */
accountModel.checkEmailExists = async function (account_email, account_id = null) {
  try {
    let sql = "SELECT * FROM account WHERE account_email = $1";
    const params = [account_email];
    
    if (account_id) {
      sql += " AND account_id != $2";
      params.push(account_id);
    }
    
    const result = await pool.query(sql, params);
    return result.rows.length > 0;
  } catch (error) {
    console.error("checkEmailExists error:", error);
    return false;
  }
};

module.exports = accountModel;
