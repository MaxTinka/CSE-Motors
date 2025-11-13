const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// MVC Routes
router.get('/', inventoryController.getInventory);
router.get('/:id', inventoryController.getInventoryItem);
router.get('/:id/update', inventoryController.getUpdateForm);
router.post('/:id/update', inventoryController.updateInventoryItem);

module.exports = router;