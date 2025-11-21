const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")

// GET inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// GET vehicle detail view
router.get("/detail/:invId", invController.buildByInvId)

module.exports = router
