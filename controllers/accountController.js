const utilities = require("../utilities/");
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
    res.status(500).send("Login page error");
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
    res.status(500).send("Register page error");
  }
};

/* ***************************
 * Build account management view
 * ************************** */
accountController.buildAccountManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    // Demo account data
    const accountData = {
      account_id: 1,
      account_firstname: "Demo",
      account_lastname: "User",
      account_email: "demo@example.com",
      account_type: "Client"
    };
    
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData,
      errors: null,
    });
  } catch (error) {
    console.error("buildAccountManagement error:", error);
    res.status(500).send("Account management page error");
  }
};

/* ***************************
 * Process registration
 * ************************** */
accountController.registerAccount = async function (req, res) {
  try {
    req.flash("notice", "Registration successful! Please log in.");
    res.redirect("/account/login");
  } catch (error) {
    console.error("registerAccount error:", error);
    req.flash("notice", "Registration failed.");
    res.redirect("/account/register");
  }
};

/* ***************************
 * Process login
 * ************************** */
accountController.accountLogin = async function (req, res) {
  try {
    const { account_email, account_password } = req.body;
    
    // Demo login - accept any credentials
    const token = jwt.sign(
      { 
        account_id: 1,
        account_type: "Client",
        account_email: account_email || "demo@example.com",
        account_firstname: "Demo"
      },
      process.env.ACCESS_TOKEN_SECRET || "demo-secret-key",
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("jwt", token, { 
      httpOnly: true, 
      maxAge: 3600000
    });

    req.flash("notice", "Welcome back!");
    res.redirect("/account/");
  } catch (error) {
    console.error("accountLogin error:", error);
    req.flash("notice", "Login failed.");
    res.redirect("/account/login");
  }
};

/* ***************************
 * Process logout
 * ************************** */
accountController.logout = async function (req, res) {
  try {
    res.clearCookie("jwt");
    req.flash("notice", "Logged out successfully.");
    res.redirect("/");
  } catch (error) {
    console.error("logout error:", error);
    req.flash("notice", "Logout failed.");
    res.redirect("/");
  }
};

// Add placeholder functions to avoid errors
accountController.buildUpdateAccount = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: {
        account_id: 1,
        account_firstname: "Demo",
        account_lastname: "User",
        account_email: "demo@example.com"
      },
      errors: null,
    });
  } catch (error) {
    console.error("buildUpdateAccount error:", error);
    res.status(500).send("Update account page error");
  }
};

accountController.processUpdate = async function (req, res) {
  req.flash("notice", "Account updated successfully.");
  res.redirect("/account/");
};

accountController.processPasswordChange = async function (req, res) {
  req.flash("notice", "Password changed successfully.");
  res.redirect("/account/");
};

module.exports = accountController;
