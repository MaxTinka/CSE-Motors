const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invController = {};

// Build inventory by classification view
invController.buildByClassificationId = async function (req, res, next) {
  // Your code here
};

// Build vehicle detail view
invController.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryById(inv_id);
  const grid = await utilities.buildVehicleDetail(data);
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    grid,
  });
};
