const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  let data = await invModel.getInventoryByClassificationId(classification_id)
  
  if (!data || data.length === 0) {
    // Handle no vehicles found
    let nav = await utilities.getNav()
    res.render("./inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: '<p class="notice">Sorry, no matching vehicles could be found.</p>',
    })
    return
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invController.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  let data = await invModel.getInventoryById(inv_id)
  
  // ADD THIS NULL CHECK - FIXES THE ERROR
  if (!data) {
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: "Vehicle Not Found",
      nav,
      grid: '<p class="notice">Sorry, vehicle details could not be found.</p>',
    })
    return
  }
  
  const grid = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    grid,
  })
}

module.exports = invController
