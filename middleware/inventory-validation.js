const utilities = require("../utilities/")

/* ***************************
 *  Classification Validation Rules
 * ************************** */
const invValidate = {}

invValidate.classificationRules = () => {
  return [
    // classification_name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlpha()
      .withMessage("Classification name must contain only letters (no spaces or special characters).")
  ]
}

/* ***************************
 *  Check classification data and return errors or continue to registration
 * ************************** */
invValidate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ***************************
 *  Inventory Validation Rules
 * ************************** */
invValidate.inventoryRules = () => {
  return [
    // classification_id is required
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),
    
    // inv_make is required
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."),
    
    // inv_model is required  
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle model."),
    
    // inv_year is required and must be 4 digits
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be 4 digits.")
      .isNumeric()
      .withMessage("Year must be a number."),
    
    // inv_description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),
    
    // inv_price is required and must be numeric
    body("inv_price")
      .isNumeric()
      .withMessage("Price must be a number.")
      .isFloat({ min: 0 })
      .withMessage("Price must be greater than 0."),
    
    // inv_miles is required and must be numeric
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),
    
    // inv_color is required
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color.")
  ]
}

/* ***************************
 *  Check inventory data and return errors or continue
 * ************************** */
invValidate.checkInventoryData = async (req, res, next) => {
  const { 
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_miles, inv_color 
  } = req.body
  
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle", 
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model, 
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price, 
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = invValidate
