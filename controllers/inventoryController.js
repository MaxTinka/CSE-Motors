const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");
const invController = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view:", error);
    next(error);
  }
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getInventoryByInventoryId(inventory_id);
    const detailHTML = await utilities.buildVehicleDetail(data);
    let nav = await utilities.getNav();
    const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      detailHTML,
    });
  } catch (error) {
    console.error("Error building vehicle detail view:", error);
    next(error);
  }
};

/* ***************************
 *  Build management view
 * ************************** */
invController.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null,
    });
  } catch (error) {
    console.error("Error building management view:", error);
    next(error);
  }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invController.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error building add classification view:", error);
    next(error);
  }
};

/* ***************************
 *  Process add classification
 * ************************** */
invController.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);
    
    if (result) {
      let nav = await utilities.getNav();
      req.flash("notice", `Classification "${classification_name}" was successfully added.`);
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect: await utilities.buildClassificationList(),
        errors: null,
      });
    } else {
      throw new Error("Failed to add classification");
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, adding classification failed.");
    res.status(500).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invController.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    });
  } catch (error) {
    console.error("Error building add inventory view:", error);
    next(error);
  }
};

/* ***************************
 *  Process add inventory
 * ************************** */
invController.addInventory = async function (req, res, next) {
  try {
    const { 
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
    } = req.body;

    const result = await invModel.addInventory(
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
    );
    
    if (result) {
      let nav = await utilities.getNav();
      req.flash("notice", `Vehicle ${inv_year} ${inv_make} ${inv_model} was successfully added.`);
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect: await utilities.buildClassificationList(),
        errors: null,
      });
    } else {
      throw new Error("Failed to add vehicle");
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    req.flash("notice", "Sorry, adding vehicle failed.");
    res.status(500).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
      return res.json(invData);
    } else {
      next(new Error("No data returned"));
    }
  } catch (error) {
    console.error("Error getting inventory JSON:", error);
    next(error);
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.buildEditInventory = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInventoryId(inventory_id);
    const classificationSelect = await utilities.buildClassificationList();
    
    const itemName = `${itemData[0].inv_year} ${itemData[0].inv_make} ${itemData[0].inv_model}`;
    
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id
    });
  } catch (error) {
    console.error("Error building edit inventory view:", error);
    next(error);
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invController.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    const { 
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body;

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemData = await invModel.getInventoryByInventoryId(inv_id);
      const itemName = `${itemData[0].inv_year} ${itemData[0].inv_make} ${itemData[0].inv_model}`;
      
      req.flash("notice", `The ${itemName} was successfully updated.`);
      res.redirect("/inv/");
    } else {
      const classificationSelect = await utilities.buildClassificationList();
      const itemName = `${inv_year} ${inv_make} ${inv_model}`;
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      });
    }
  } catch (error) {
    console.error("Error updating inventory:", error);
    next(error);
  }
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invController.buildDeleteInventory = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInventoryId(inventory_id);
    const itemName = `${itemData[0].inv_year} ${itemData[0].inv_make} ${itemData[0].inv_model}`;
    
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
    });
  } catch (error) {
    console.error("Error building delete inventory view:", error);
    next(error);
  }
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invController.deleteInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const inv_id = parseInt(req.body.inv_id);
    
    const deleteResult = await invModel.deleteInventory(inv_id);
    
    if (deleteResult) {
      req.flash("notice", "The vehicle was successfully deleted.");
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the delete failed.");
      res.redirect("/inv/delete/" + inv_id);
    }
  } catch (error) {
    console.error("Error deleting inventory:", error);
    next(error);
  }
};

module.exports = invController;
