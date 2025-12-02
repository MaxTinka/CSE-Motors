const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Public routes (no authentication required)
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Basic management routes (temporarily without auth)
router.get("/", invController.buildManagement);
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);

module.exports = router;
