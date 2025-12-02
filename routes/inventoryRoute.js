const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");
const invAuth = require("../middleware/inventory-auth");

// Public routes (no authentication required)
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// Protected routes (require Employee or Admin)
router.get("/", invAuth.requireEmployeeOrAdmin, invController.buildManagement);
router.get("/add-classification", invAuth.requireEmployeeOrAdmin, invController.buildAddClassification);
router.post("/add-classification", invAuth.requireEmployeeOrAdmin, invController.addClassification);
router.get("/add-inventory", invAuth.requireEmployeeOrAdmin, invController.buildAddInventory);
router.post("/add-inventory", invAuth.requireEmployeeOrAdmin, invController.addInventory);
router.get("/edit/:inventory_id", invAuth.requireEmployeeOrAdmin, invController.buildEditInventory);
router.post("/update/", invAuth.requireEmployeeOrAdmin, invController.updateInventory);
router.get("/delete/:inventory_id", invAuth.requireEmployeeOrAdmin, invController.buildDeleteInventory);
router.post("/delete/", invAuth.requireEmployeeOrAdmin, invController.deleteInventory);

module.exports = router;
