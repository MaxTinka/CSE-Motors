const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

// Build management view
invController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash('message') || null,
    messageType: req.flash('messageType') || null
  })
}

// Build add classification view
invController.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification", 
    nav,
    message: req.flash('message') || null,
    classification_name: req.flash('classification_name') || null
  })
}

// Build add inventory view
invController.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    message: req.flash('message') || null,
    ...req.flash('formData') || {}
  })
}

// Add new classification
invController.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const addResult = await invModel.addClassification(classification_name)
  
  if (addResult) {
    req.flash('message', `Classification "${classification_name}" was successfully added.`)
    req.flash('messageType', 'success')
    res.redirect("/inv/")
  } else {
    req.flash('message', "Sorry, the classification could not be added.")
    req.flash('classification_name', classification_name)
    res.redirect("/inv/add-classification")
  }
}

// Add new inventory
invController.addInventory = async function (req, res, next) {
  const { 
    classification_id, inv_make, inv_model, inv_year, 
    inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_miles, inv_color 
  } = req.body
  
  const addResult = await invModel.addInventory({
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color
  })
  
  if (addResult) {
    req.flash('message', `Vehicle "${inv_make} ${inv_model}" was successfully added.`)
    req.flash('messageType', 'success')
    res.redirect("/inv/")
  } else {
    req.flash('message', "Sorry, the vehicle could not be added.")
    req.flash('formData', req.body)
    res.redirect("/inv/add-inventory")
  }
}

// Keep existing functions...
module.exports = invController
