const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const authMiddleware = require("../utilities/authMiddleware");

// Public routes
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);
router.post("/login", accountController.accountLogin);

// Protected routes
router.get("/", authMiddleware.requireLogin, accountController.buildAccountManagement);
router.get("/update", authMiddleware.requireLogin, accountController.buildUpdateAccount);

// Update routes with validation middleware
router.post("/update", 
  authMiddleware.requireLogin,
  accountController.validateUpdate,
  accountController.processUpdate
);

router.post("/update-password",
  authMiddleware.requireLogin,
  accountController.validatePassword,
  accountController.processPasswordChange
);

// Logout route
router.get("/logout", accountController.logout);

module.exports = router;
