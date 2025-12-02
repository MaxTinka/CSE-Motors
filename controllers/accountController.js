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
 * Process registration
 * ************************** */
accountController.registerAccount = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    const { 
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password 
    } = req.body;

    // For now, just redirect to login
    req.flash(
      "notice",
      `Congratulations, you're registered. Please log in.`
    );
    return res.redirect("/account/login");
  } catch (error) {
    console.error("registerAccount error:", error);
    req.flash("notice", "Sorry, the registration failed.");
    return res.redirect("/account/register");
  }
};

/* ***************************
 * Process login
 * ************************** */
accountController.accountLogin = async function (req, res) {
  try {
    const { account_email, account_password } = req.body;
    
    // Simple authentication for now
    // In a real app, you would check against database
    if (account_email && account_password) {
      // Create a simple JWT token
      const token = jwt.sign(
        { 
          account_id: 1,
          account_type: "Client",
          account_email: account_email,
          account_firstname: "User"
        },
        process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );

      // Set cookie
      res.cookie("jwt", token, { 
        httpOnly: true, 
        maxAge: 3600000 // 1 hour
      });

      req.flash("notice", `Welcome back!`);
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.redirect("/account/login");
    }
  } catch (error) {
    console.error("accountLogin error:", error);
    req.flash("notice", "Sorry, login failed.");
    return res.redirect("/account/login");
  }
};

/* ***************************
 * Build account management view
 * ************************** */
accountController.buildAccountManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    // Simple account data for now
    const accountData = {
      account_id: 1,
      account_firstname: "User",
      account_lastname: "Name",
      account_email: "user@example.com",
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
    next(error);
  }
};

/* ***************************
 * Build update account view
 * ************************** */
accountController.buildUpdateAccount = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    // Simple account data for now
    const accountData = {
      account_id: 1,
      account_firstname: "User",
      account_lastname: "Name",
      account_email: "user@example.com",
      account_type: "Client"
    };
    
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
 * Process account update
 * ************************** */
accountController.processUpdate = async function (req, res) {
  try {
    const { 
      account_firstname, 
      account_lastname, 
      account_email 
    } = req.body;

    // For now, just show success message
    req.flash("notice", "Your account has been updated successfully.");
    return res.redirect("/account/");
  } catch (error) {
    console.error("processUpdate error:", error);
    req.flash("notice", "Sorry, the update failed.");
    return res.redirect("/account/update");
  }
};

/* ***************************
 * Process password change
 * ************************** */
accountController.processPasswordChange = async function (req, res) {
  try {
    // For now, just show success message
    req.flash("notice", "Your password has been updated successfully.");
    return res.redirect("/account/");
  } catch (error) {
    console.error("processPasswordChange error:", error);
    req.flash("notice", "Sorry, password update failed.");
    return res.redirect("/account/update");
  }
};

/* ***************************
 * Process logout
 * ************************** */
accountController.logout = async function (req, res) {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out successfully.");
    return res.redirect("/");
  } catch (error) {
    console.error("logout error:", error);
    req.flash("notice", "Logout failed.");
    return res.redirect("/");
  }
};

module.exports = accountController;
