const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountController = {};

/* ***************************
 * Build login view
 * ************************** */
accountController.buildLogin = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("buildLogin error:", error);
    next(error);
  }
};

/* ***************************
 * Build registration view
 * ************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("buildRegister error:", error);
    next(error);
  }
};

/* ***************************
 * Build account management view
 * ************************** */
accountController.buildAccountManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData,
      errors: null,
    });
  } catch (error) {
    console.error("buildAccountManagement error:", error);
    next(error);
  }
};

/* ***************************
 * Build update account view
 * ************************** */
accountController.buildUpdateAccount = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors: null,
    });
  } catch (error) {
    console.error("buildUpdateAccount error:", error);
    next(error);
  }
};

/* ***************************
 * Server-side validation for account update
 * ************************** */
accountController.validateUpdate = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const errors = {};
  
  // Validate first name
  if (!account_firstname || account_firstname.trim().length < 2 || account_firstname.trim().length > 50) {
    errors.account_firstname = 'First name must be between 2 and 50 characters.';
  }
  
  // Validate last name
  if (!account_lastname || account_lastname.trim().length < 2 || account_lastname.trim().length > 50) {
    errors.account_lastname = 'Last name must be between 2 and 50 characters.';
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!account_email || !emailRegex.test(account_email)) {
    errors.account_email = 'Please enter a valid email address.';
  }
  
  if (Object.keys(errors).length > 0) {
    let nav = await utilities.getNav();
    const accountData = { account_id, account_firstname, account_lastname, account_email };
    
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors,
    });
  }
  
  // Check if email already exists (excluding current user)
  const emailExists = await accountModel.checkEmailExists(account_email, account_id);
  
  if (emailExists) {
    let nav = await utilities.getNav();
    const accountData = { account_id, account_firstname, account_lastname, account_email };
    
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors: { account_email: 'Email already exists. Please use a different email.' },
    });
  }
  
  next();
};

/* ***************************
 * Process account update
 * ************************** */
accountController.processUpdate = async function (req, res) {
  try {
    const { 
      account_id,
      account_firstname, 
      account_lastname, 
      account_email 
    } = req.body;

    // Update account in database
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Update JWT token with new information
      const token = jwt.sign(
        { 
          account_id: account_id,
          account_type: res.locals.accountData.account_type,
          account_email: account_email,
          account_firstname: account_firstname,
          account_lastname: account_lastname
        },
        process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );

      // Update cookie
      res.cookie("jwt", token, { 
        httpOnly: true, 
        maxAge: 3600000,
        secure: process.env.NODE_ENV === 'production'
      });

      // Update local variables
      res.locals.accountData.account_firstname = account_firstname;
      res.locals.accountData.account_lastname = account_lastname;
      res.locals.accountData.account_email = account_email;

      // Get updated account data
      const updatedAccount = await accountModel.getAccountById(account_id);
      
      req.flash("notice", "Your account has been updated successfully.");
      return res.redirect("/account/");
    } else {
      let nav = await utilities.getNav();
      req.flash("error", "Sorry, the update failed.");
      return res.render("account/update-account", {
        title: "Update Account",
        nav,
        accountData: req.body,
        errors: null,
      });
    }
  } catch (error) {
    console.error("processUpdate error:", error);
    let nav = await utilities.getNav();
    req.flash("error", "Sorry, the update failed.");
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors: null,
    });
  }
};

/* ***************************
 * Server-side validation for password change
 * ************************** */
accountController.validatePassword = async (req, res, next) => {
  const { account_password, account_new_password, account_confirm_password } = req.body;
  const errors = {};
  
  // Validate current password
  if (!account_password) {
    errors.account_password = 'Current password is required.';
  }
  
  // Validate new password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!account_new_password) {
    errors.account_new_password = 'New password is required.';
  } else if (!passwordRegex.test(account_new_password)) {
    errors.account_new_password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
  }
  
  // Check if passwords match
  if (!account_confirm_password) {
    errors.account_confirm_password = 'Please confirm your new password.';
  } else if (account_new_password !== account_confirm_password) {
    errors.account_confirm_password = 'Passwords do not match.';
  }
  
  if (Object.keys(errors).length > 0) {
    let nav = await utilities.getNav();
    
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: await accountModel.getAccountById(req.body.account_id),
      errors,
    });
  }
  
  next();
};

/* ***************************
 * Process password change
 * ************************** */
accountController.processPasswordChange = async function (req, res) {
  try {
    const account_id = req.body.account_id;
    const { 
      account_password, 
      account_new_password 
    } = req.body;

    // Get current account data
    const accountData = await accountModel.getAccountById(account_id);
    
    // Check current password
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (!passwordMatch) {
      let nav = await utilities.getNav();
      return res.render("account/update-account", {
        title: "Update Account",
        nav,
        accountData: await accountModel.getAccountById(account_id),
        errors: { account_password: 'Current password is incorrect.' },
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(account_new_password, 10);
    
    // Update password in database
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Your password has been updated successfully.");
      return res.redirect("/account/");
    } else {
      let nav = await utilities.getNav();
      req.flash("error", "Sorry, password update failed.");
      return res.render("account/update-account", {
        title: "Update Account",
        nav,
        accountData: await accountModel.getAccountById(account_id),
        errors: null,
      });
    }
  } catch (error) {
    console.error("processPasswordChange error:", error);
    let nav = await utilities.getNav();
    req.flash("error", "Sorry, password update failed.");
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: await accountModel.getAccountById(req.body.account_id),
      errors: null,
    });
  }
};

/* ***************************
 * Process logout
 * ************************** */
accountController.logout = async function (req, res) {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Clear local variables
    res.locals.loggedin = false;
    res.locals.accountData = null;
    
    req.flash("notice", "You have been logged out successfully.");
    return res.redirect("/");
  } catch (error) {
    console.error("logout error:", error);
    req.flash("notice", "Logout failed.");
    return res.redirect("/");
  }
};

module.exports = accountController;
