const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Public routes
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);
router.post("/login", accountController.accountLogin);

// Protected routes (require login)
router.get("/", accountController.buildAccountManagement);
router.get("/update", accountController.buildUpdateAccount);
router.post("/update", accountController.processUpdate);
router.post("/update-password", accountController.processPasswordChange);

// Logout route
router.get("/logout", accountController.logout);

module.exports = router;
