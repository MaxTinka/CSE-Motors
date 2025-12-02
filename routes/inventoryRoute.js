const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Public routes (no authentication required)
router.get("/", invController.buildManagement); // Make this public
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// Protected routes (require Employee or Admin)
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);
router.get("/edit/:inventory_id", invController.buildEditInventory);
router.post("/update/", invController.updateInventory);
router.get("/delete/:inventory_id", invController.buildDeleteInventory);
router.post("/delete/", invController.deleteInventory);

module.exports = router;
