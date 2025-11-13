const { inventoryModel } = require('../models/database');

const inventoryController = {
  // Get all inventory - MVC View
  async getInventory(req, res) {
    try {
      const inventory = await inventoryModel.getAllInventory();
      res.render('inventory', {
        title: 'Vehicle Inventory - CSE Motors',
        inventory: inventory,
        page: 'inventory'
      });
    } catch (error) {
      console.error('Error in getInventory controller:', error);
      res.status(500).render('error', {
        title: 'Error - CSE Motors',
        message: 'Unable to load inventory'
      });
    }
  },

  // Get inventory by ID - MVC View
  async getInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const vehicle = await inventoryModel.getInventoryById(id);
      
      if (!vehicle) {
        return res.status(404).render('error', {
          title: 'Not Found - CSE Motors',
          message: 'Vehicle not found'
        });
      }

      res.render('inventory-detail', {
        title: `${vehicle.inv_make} ${vehicle.inv_model} - CSE Motors`,
        vehicle: vehicle,
        page: 'inventory'
      });
    } catch (error) {
      console.error('Error in getInventoryItem controller:', error);
      res.status(500).render('error', {
        title: 'Error - CSE Motors',
        message: 'Unable to load vehicle details'
      });
    }
  },

  // Update inventory form - MVC View
  async getUpdateForm(req, res) {
    try {
      const { id } = req.params;
      const vehicle = await inventoryModel.getInventoryById(id);
      
      if (!vehicle) {
        return res.status(404).render('error', {
          title: 'Not Found - CSE Motors',
          message: 'Vehicle not found'
        });
      }

      res.render('inventory-update', {
        title: `Update ${vehicle.inv_make} ${vehicle.inv_model} - CSE Motors`,
        vehicle: vehicle,
        page: 'inventory'
      });
    } catch (error) {
      console.error('Error in getUpdateForm controller:', error);
      res.status(500).render('error', {
        title: 'Error - CSE Motors',
        message: 'Unable to load update form'
      });
    }
  },

  // Process inventory update - MVC Controller
  async updateInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedVehicle = await inventoryModel.updateInventory(id, updateData);
      
      res.redirect(`/inventory/${id}`);
    } catch (error) {
      console.error('Error in updateInventoryItem controller:', error);
      res.status(500).render('error', {
        title: 'Error - CSE Motors',
        message: 'Unable to update vehicle'
      });
    }
  }
};

module.exports = inventoryController;