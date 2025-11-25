const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities/")
const invValidate = require("../middleware/inventory-validation")

// GET management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// GET add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// GET add inventory view  
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// POST new classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// POST new inventory
router.post(
  "/add-inventory", 
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Existing routes
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

module.exports = router
